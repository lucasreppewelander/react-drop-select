import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './styles/index.css';

class Dropdown extends Component {

	constructor(props) {
		super(props);

		this.hide = this.hide.bind(this);
		this.state = {
			visible: false,
			selected: null,
			searchStr: null
		}
	}

	select(item) {
		if (this.props.type === 'search') {
			this.setState({ selected: item, visible: false });
		} else {
			this.setState({ selected: item });
		}

		this.props.selected(item);
	}

	show() {
		this.setState({ visible: true });
		document.addEventListener('click', this.hide);
	}

	hide() {
		this.setState({ visible: false });
		document.removeEventListener('click', this.hide);
	}

	showWithoutEventListener() {
		this.setState({ visible: true });
	}

	search(e) {
		this.setState({ searchStr: e.target.value });
	}

	renderListItems() {
		var self = this;
		const { options, list } = this.props;
		const items = [];

		if (this.state.searchStr) {
			for (let i = 0; i < list.length; i++) {
				let item = list[i];

				if (item.text.toLowerCase().indexOf(self.state.searchStr) > -1) {
					items.push(
						<div
							className='dropdown__listItem'
							key={item.text}
							onClick={() => {
								self.select(item)
							}}
						>
							{item.text}
						</div>
					)
				}
			}

			return items;
		}

		for (let i = 0; i < list.length; i++) {
			let item = list[i];

			if (options && options.formatResult) {
				const newItem = options.formatResult(item, self.state.selected, self.select.bind(self));
				items.push(newItem);
			} else if (item === self.state.selected) {
				items.push(
					<div
						className='dropdown__listItem--selected'
						key={item.text}
						onClick={() => {
							self.select(item)
						}}
					>
						{item.text}
						<i className='fa fa-check dropdown__selectedItem' />
					</div>
				)
			} else {
				items.push(
					<div
						className='dropdown__listItem'
						key={item.text}
						onClick={() => {
							self.select(item)
						}}
					>
						{item.text}
					</div>
				)
			}
		}

		return items;
	}

	formatSelected() {
		const { list, placeholder, options, icon } = this.props;

		if (this.state.selected) {
			if (options && options.formatSelect) {
				const ret = options.formatSelect(this.state.selected);
				if (typeof ret === 'object' && typeof ret.props === 'object') {
					return {text: ret}
				}

				return ret;
			}

			return {text: this.state.selected.text};
		}

		if (this.props.placeholder) {
			return {text: this.props.placeholder};
		}

		if (this.props.list.length) {
			return {text: this.props.list[0].text};
		}

		return {text: 'Not set'};
	}

	render() {
		const { icon, width, height, type, placeholder, color} = this.props;
		const res = this.formatSelected();
		let dropdownHead;

		dropdownHead = (
			<div
				className={'dropdown__head' + (this.state.visible ? ' dropdown__head--clicked': '')}
				onClick={() => {
					type === 'search' ? this.showWithoutEventListener() : this.show()
				}}
			>
				{icon && <i className={icon}></i>}
				<span className={icon ? 'dropdown__title--icon' : 'dropdown__title'}>{res.text}</span>
				<i className='fa fa-angle-down'></i>
			</div>
		)

		if (res.image) {
			dropdownHead = (
				<div
					className={'dropdown__head' + (this.state.visible ? ' dropdown__head--clicked': '')}
					onClick={() => {
						type === 'search' ? this.showWithoutEventListener() : this.show()
					}}
				>
					<img className='dropdown__avatar' src={res.image} />
					<span className='dropdown__title--icon'>{res.text}</span>
					<i className='fa fa-angle-down'></i>
				</div>
			)	
		}

		if (type === 'search' && this.state.visible) {
			dropdownHead = (
				<div className={'dropdown__head' + (this.state.visible ? ' dropdown__head--clicked': '')}>
					<input
						className='dropdown__search'
						placeholder={placeholder ? placeholder : 'Search'}
						type='text'
						defaultValue={this.state.searchStr}
						onChange={this.search.bind(this)}
					/>
					<i
						className='fa fa-search'
						title='Click this icon to close the dropdown.'
						onClick={() => {
							this.hide()
						}}
					/>
				</div>
			);
		}

		return (
			<div
				style={{ width: width ? `${width}` : null }}
				className={'dropdown' + (this.state.visible ? ' dropdown--show' : '') + (color ? ` ${color}` : '')}
			>
				{dropdownHead}
				<div className='dropdown__body'>
					<div className='dropdown__bodyHolder' style={{ maxHeight: height ? height : '174px' }}>
						{this.renderListItems()}
					</div>
				</div>
			</div>
		)
	}
}

Dropdown.propTypes = {
	list: PropTypes.array,
	selected: PropTypes.func
};

export default Dropdown;