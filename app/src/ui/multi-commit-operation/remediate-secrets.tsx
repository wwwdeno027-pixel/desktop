import React from 'react'
import { MultiCommitOperationKind } from '../../models/multi-commit-operation'
import { BaseRebase } from './base-rebase'
import { AmendCommitDialog } from './dialog/amend-commit-dialog'

export abstract class RemediateSecrets extends BaseRebase {
  protected conflictDialogOperationPrefix = 'remediating secrets in commits on'
  protected rebaseKind = MultiCommitOperationKind.RemediateSecret

  protected onContinueAfterAmendCommit = async () => {
    const { state, dispatcher, repository } = this.props
    const { operationDetail } = state

    if (operationDetail.kind !== MultiCommitOperationKind.RemediateSecret) {
      this.endFlowInvalidState()
      return
    }

    const { commits } = operationDetail

    await dispatcher.switchMultiCommitOperationToShowProgress(repository)

    const rebaseResult = await dispatcher.continueRebaseAfterAmendCommit(
      this.props.repository
    )
    await dispatcher.processMultiCommitOperationRebaseResult(
      this.rebaseKind,
      repository,
      rebaseResult,
      commits.length + 1,
      'This branch',
      'Current commit'
    )
  }

  protected renderAmendCommit = () => {
    const {
      state: { operationDetail },
      accounts,
      emoji,
    } = this.props
    if (operationDetail.kind !== MultiCommitOperationKind.RemediateSecret) {
      this.endFlowInvalidState()
      return null
    }
    const { currentTip, commits, secrets } = operationDetail
    const currentCommit = commits.find(c => c.sha === currentTip)

    if (!currentCommit) {
      this.endFlowInvalidState()
      return null
    }

    const impactedSecrets = secrets.map(s => {
      const impactedLocations = s.locations.some(
        l => l.commitSha === currentCommit.sha
      )
      if (!impactedLocations) {
        return null
      }
      const paths = s.locations.map(l => {
        if (l.commitSha === currentCommit.sha) {
          return (
            <li key={l.commitSha}>
              {l.path} at {l.lineNumber}
            </li>
          )
        }
        return null
      })

      return (
        <div key={s.id}>
          <p>
            For <b>{s.description}</b>
          </p>
          <ul>{paths}</ul>
        </div>
      )
    })

    return (
      <AmendCommitDialog
        operation={'to Remediate Secrets'}
        emoji={emoji}
        commit={currentCommit}
        accounts={accounts}
        onContinueRebase={this.onContinueAfterAmendCommit}
        onAbort={this.onAbort}
        onDismissed={this.onFlowEnded}
      >
        <p>
          Please open the files and remove the secrets from the following
          locations:
        </p>
        {impactedSecrets}
      </AmendCommitDialog>
    )
  }
}
