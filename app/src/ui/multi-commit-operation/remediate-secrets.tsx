import { MultiCommitOperationKind } from '../../models/multi-commit-operation'
import { BaseRebase } from './base-rebase'

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
}
