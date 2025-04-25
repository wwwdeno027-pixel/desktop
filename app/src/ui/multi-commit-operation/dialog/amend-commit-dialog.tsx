import * as React from 'react'
import { Dialog, DialogContent, DialogFooter } from '../../dialog'
import { OkCancelButtonGroup } from '../../dialog/ok-cancel-button-group'
import { Commit } from '../../../models/commit'
import { CommitListItem } from '../../history/commit-list-item'
import { Account } from '../../../models/account'
import { Emoji } from '../../../lib/emoji'

interface IAmendCommitDialogProps {
  readonly operation: string
  readonly commit: Commit
  readonly accounts: ReadonlyArray<Account>
  readonly emoji: Map<string, Emoji>
  readonly onContinueRebase: () => Promise<void>
  readonly onAbort: () => Promise<void>
  readonly onDismissed: () => void
}

interface IAmendCommitDialogState {
  readonly isAborting: boolean
}

export class AmendCommitDialog extends React.Component<
  IAmendCommitDialogProps,
  IAmendCommitDialogState
> {
  public constructor(props: IAmendCommitDialogProps) {
    super(props)
    this.state = {
      isAborting: false,
    }
  }

  private onSubmit = async () => {
    this.props.onContinueRebase()
  }

  private onAbort = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    this.setState({ isAborting: true })
    await this.props.onAbort()
    this.setState({ isAborting: false })
  }

  public render() {
    const { operation, commit, emoji, accounts } = this.props
    return (
      <Dialog
        className="amend-commit-dialog"
        title={
          __DARWIN__
            ? `Amend Commit ${operation}`
            : `Amend commit ${operation.toLowerCase()}`
        }
        onDismissed={this.props.onDismissed}
        onSubmit={this.onSubmit}
        disabled={this.state.isAborting}
      >
        <DialogContent>
          <div>
            <p>You are amending the following commit:</p>
            <div className="commit-list-item-container">
              <CommitListItem
                commit={commit}
                emoji={emoji}
                gitHubRepository={null}
                showUnpushedIndicator={false}
                selectedCommits={[commit]}
                accounts={accounts}
              />
            </div>
            {this.props.children}
          </div>
        </DialogContent>
        <DialogFooter>
          <OkCancelButtonGroup
            okButtonText={'Continue'}
            cancelButtonText={'Abort'}
            onCancelButtonClick={this.onAbort}
            cancelButtonDisabled={this.state.isAborting}
          />
        </DialogFooter>
      </Dialog>
    )
  }
}
