import * as React from 'react'
import { ITextBoxProps, TextBox } from './text-box'
import { Button } from './button'
import { Octicon } from '../octicons'
import * as octicons from '../octicons/octicons.generated'
import { Popover, PopoverAnchorPosition, PopoverDecoration } from './popover'
import { Checkbox, CheckboxValue } from './checkbox'

interface IFilterSelectionTextBoxState {
  readonly isPopoverOpen: boolean
}

export class FilterSelectionTextBox extends React.Component<
  ITextBoxProps,
  IFilterSelectionTextBoxState
> {
  private filterIconRef = React.createRef<HTMLSpanElement>()
  public textBoxRef = React.createRef<TextBox>()

  public constructor(props: ITextBoxProps) {
    super(props)
    this.state = {
      isPopoverOpen: false,
    }
  }

  private onToggleFilterSelection = (
    event: React.FormEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
    if (this.state.isPopoverOpen) {
      this.closePopover()
    } else {
      this.openPopover()
    }
  }

  private openPopover = () => {
    this.setState(prevState => {
      if (!prevState.isPopoverOpen) {
        return { isPopoverOpen: true }
      }
      return null
    })
  }

  private closePopover = () => {
    this.setState(prevState => {
      if (prevState.isPopoverOpen) {
        return { isPopoverOpen: false }
      }

      return null
    })
  }

  private renderPopover() {
    return (
      <Popover
        ariaLabelledby="filter-popover-header"
        anchor={this.filterIconRef.current}
        anchorPosition={PopoverAnchorPosition.BottomRight}
        decoration={PopoverDecoration.Balloon}
        onMousedownOutside={this.closePopover}
        onClickOutside={this.closePopover}
      >
        <h3 id="filter-popover-header">Filter Options</h3>
        <Checkbox
          value={CheckboxValue.Off}
          label="Checked Changes (to be committed)"
        />
      </Popover>
    )
  }

  public render() {
    return (
      <>
        <Button onClick={this.onToggleFilterSelection}>
          <span ref={this.filterIconRef}>
            <Octicon className="prefixed-icon" symbol={octicons.search} />
          </span>
          <Octicon className="prefixed-icon" symbol={octicons.triangleDown} />
        </Button>
        <TextBox ref={this.textBoxRef} {...this.props} />
        {this.state.isPopoverOpen && this.renderPopover()}
      </>
    )
  }
}
