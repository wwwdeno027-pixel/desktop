import classNames from 'classnames'
import * as React from 'react'

interface ISegmentedItemProps<T> {
  /**
   * An id for the item, used to assist in accessibility
   */
  readonly id: string
  readonly parentId?: string

  /**
   * The value of the item among the other choices in the segmented
   * control. This is passed along to the onClick handler to differentiate
   * between clicked items.
   */
  readonly value: T

  /**
   * The title for the segmented item. This should be kept short.
   */
  readonly title: string

  /**
   * An optional description which explains the consequences of
   * selecting this item.
   */
  readonly description?: string | JSX.Element

  /**
   * Whether or not the item is currently the active selection among the
   * other choices in the segmented control.
   */
  readonly isSelected: boolean

  /**
   * A function that's called when a user double-clicks on the item
   * using a pointer device.
   */
  readonly onDoubleClick: (value: T) => void

  /**
   * A function that's called when a user selects the item using a
   * keyboard.
   */
  readonly onSelected: (value: T) => void
}

export class SegmentedItem<T> extends React.Component<
  ISegmentedItemProps<T>,
  {}
> {
  private onDoubleClick = () => {
    this.props.onDoubleClick(this.props.value)
  }

  public render() {
    const description = this.props.description ? (
      <p>{this.props.description}</p>
    ) : undefined

    const isSelected = this.props.isSelected
    const className = isSelected ? 'selected' : undefined

    return (
      <div className={classNames('segmented-item', { selected: isSelected })}>
        <input
          type="radio"
          className={className}
          onChange={this.onSelect}
          id={this.props.id}
          name={this.props.parentId}
          aria-checked={isSelected ? 'true' : 'false'}
        />
        <label
          className={className}
          htmlFor={this.props.id}
          onDoubleClick={this.onDoubleClick}
        >
          <div className="title">{this.props.title}</div>
          {description}
        </label>
      </div>
    )
  }

  private onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      this.props.onSelected(this.props.value)
    }
  }
}
