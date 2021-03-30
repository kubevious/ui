import React, { Fragment } from "react"
import Autocomplete from "react-autocomplete"
import { CurrentInput, FilterType, KindListValue } from "../types"

export const SearchAutocomplete = ({
	values,
	payload,
	currentInput,
	autocomplete,
	handleFilterInput,
	fetchKeys,
	fetchValues,
	addInputField,
	clearFilter
}: {
	values: KindListValue[],
	payload: string,
	currentInput: CurrentInput,
	autocomplete: Autocomplete,
	handleFilterInput: (value: string, name: string, title: FilterType) => void
	fetchKeys: (type: string, criteria: string) => void
	fetchValues: (type: string, key: string, criteria: string) => void
	addInputField: (type: string) => boolean
	clearFilter: (type: string) => void
}) => {
	return (
		<div className="filter-input-box">
			{values &&
				values.map((item, index) => {
					const currentKey = currentInput[payload].key
					const currentVal = currentInput[payload].value
					return (
						<Fragment key={item.title}>
							<label>{item.title}</label>
							{item.title === "Label" ||
								item.title === "Annotation" ? (
								<Autocomplete
									getItemValue={(value) => value}
									items={autocomplete[payload].keys}
									value={currentKey}
									onChange={(e) =>
										handleFilterInput(
											e.target.value,
											payload,
											item.payload
										)
									}
									onSelect={(val) =>
										handleFilterInput(
											val,
											payload,
											item.payload
										)
									}
									renderItem={(content) => (
										<div>{content}</div>
									)}
									renderMenu={(items) => (
										<div
											className="autocomplete"
											children={items}
										/>
									)}
									renderInput={(props) => (
										<input
											disabled={
												currentInput[payload].disabled
											}
											{...props}
										/>
									)}
									onMenuVisibilityChange={() =>
										fetchKeys(payload, currentKey)
									}
								/>
							) : (
								<Autocomplete
									getItemValue={(value) => value}
									items={autocomplete[payload].values}
									value={currentVal}
									onChange={(e) =>
										handleFilterInput(
											e.target.value,
											payload,
											item.payload
										)
									}
									onSelect={(val) =>
										handleFilterInput(
											val,
											payload,
											item.payload
										)
									}
									renderItem={(content) => (
										<div>{content.substring(0, 70)}</div>
									)}
									renderMenu={(items, index) => (
										<div
											key={index}
											className="autocomplete"
											children={items}
										/>
									)}
									renderInput={(props) => (
										<input
											disabled={!currentKey}
											{...props}
										/>
									)}
									onMenuVisibilityChange={() =>
										fetchValues(
											payload,
											currentKey,
											currentVal
										)
									}
								/>
							)}
						</Fragment>
					)
				})}
			{currentInput[payload].key &&
				currentInput[payload].value && (
					<div className="filter-input-btns">
						<button
							type="button"
							className="add-filter-btn"
							onClick={() => addInputField(payload)}
						>
							Add
            </button>
						<button
							type="button"
							onClick={() => clearFilter(payload)}
						>
							Remove
            </button>
					</div>
				)}
		</div>)
}
