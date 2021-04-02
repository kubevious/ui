import React, { FC, Fragment } from "react"
import Autocomplete from "react-autocomplete"
import { CurrentInput, FilterType, KindListValue, SearchState } from "../../types"
import { Search } from "../.."
import { isEmptyArray } from "../../../../utils/util"
import { keyCheck } from "../../util"
import { FilterComponentProps } from "../../types"

// export const SearchAutocomplete = ({
// 	values,
// 	payload,
// 	currentInput,
// 	autocomplete,
// 	self,
// }: {
// 	values: KindListValue[],
// 	payload: string,
// 	currentInput: CurrentInput,
// 	autocomplete: Autocomplete,
// 	self: Search
// }) => {
// 	const fetchKeys = (type: string, criteria: string): void => {
// 		return self.service.fetchAutocompleteKeys(
// 			type,
// 			{ criteria },
// 			(response) => {
// 				self.setState((prevState: SearchState) => {
// 					prevState.autocomplete[type].keys = response
// 					return {
// 						...prevState,
// 						autocomplete: {
// 							...prevState.autocomplete,
// 						},
// 					}
// 				})
// 			}
// 		)
// 	}

// 	const fetchValues = (type: string, key: string, criteria: string): void => {
// 		if (!key) {
// 			return
// 		}
// 		self.service.fetchAutocompleteValues(
// 			type,
// 			{ key, criteria },
// 			(response) => {
// 				self.setState((prevState: SearchState) => {
// 					prevState.autocomplete[type].values = response
// 					return {
// 						...prevState,
// 						autocomplete: {
// 							...prevState.autocomplete,
// 						},
// 					}
// 				})
// 			}
// 		)
// 	}

// 	const handleFilterInput = (value: string, name: string, title: FilterType): void => {
// 		self.setState((prevState: SearchState) => {
// 			if (title === "key") {
// 				fetchKeys(name, value)
// 				prevState.currentInput[name].key = value
// 				return {
// 					...prevState,
// 					currentInput: {
// 						...prevState.currentInput,
// 					},
// 				}
// 			}
// 			const currentKey: string = prevState.currentInput[name].key
// 			fetchValues(name, currentKey, value)
// 			prevState.currentInput[name].value = value
// 			return {
// 				...prevState,
// 				currentInput: {
// 					...prevState.currentInput,
// 				},
// 			}
// 		})
// 	}

// 	const addInputField = (type: string): boolean => {
// 		self.setState(
// 			(prevState: SearchState) => {
// 				const input = prevState.currentInput[type]
// 				if (!input.key) {
// 					return {
// 						...prevState,
// 					}
// 				}
// 				const savedInState = prevState.savedFilters
// 				const currentInputInState = prevState.currentInput
// 				const searchValue: {
// 					key: string
// 					value: string
// 				}[] = prevState.value[type] || []
// 				const elementIndex = searchValue.findIndex((el) => el.key === input.key)
// 				elementIndex !== -1
// 					? (searchValue[elementIndex] = input)
// 					: searchValue.push(input)
// 				const searchValueInSaved: {
// 					key: string
// 					value: string
// 				}[] = savedInState[type] || []
// 				const filteredSaved = searchValueInSaved.filter(
// 					(el) => el.key !== input.key
// 				)
// 				savedInState[type] = filteredSaved
// 				isEmptyArray(filteredSaved) && delete savedInState[type]
// 				currentInputInState[type] = { key: "", value: "" }
// 				return {
// 					value: {
// 						...prevState.value,
// 						[type]: searchValue,
// 					},
// 					savedFilters: {
// 						...savedInState,
// 					},
// 					currentInput: {
// 						...currentInputInState,
// 					},
// 				}
// 			},
// 			() => {
// 				self.fetchResults(self.state.value)
// 			}
// 		)
// 		return false
// 	}

// 	const clearFilter = (type: string): void => {
// 		self.setState(
// 			(prevState: SearchState) => {
// 				const { key }: { key: string } = prevState.currentInput[type]
// 				const valueInState = prevState.value
// 				const changedValueArray: FilterType[] =
// 					valueInState[type] &&
// 					valueInState[type].filter((el: FilterType) => keyCheck(el, key))
// 				isEmptyArray(changedValueArray)
// 					? delete valueInState[type]
// 					: (valueInState[type] = changedValueArray)
// 				return {
// 					...prevState,
// 					currentInput: {
// 						...prevState.currentInput,
// 						[type]: {
// 							key: "",
// 							value: "",
// 						},
// 						value: {
// 							...valueInState,
// 						},
// 					},
// 				}
// 			},
// 			() => {
// 				self.fetchResults(self.state.value)
// 			}
// 		)
// 	}

// 	return (
// 		<div className="filter-input-box">
// 			{values &&
// 				values.map((item, index) => {
// 					const currentKey = currentInput[payload].key
// 					const currentVal = currentInput[payload].value
// 					return (
// 						<Fragment key={item.title}>
// 							<label>{item.title}</label>
// 							{item.title === "Label" ||
// 								item.title === "Annotation" ? (
// 								<Autocomplete
// 									getItemValue={(value) => value}
// 									items={autocomplete[payload].keys}
// 									value={currentKey}
// 									onChange={(e) =>
// 										handleFilterInput(
// 											e.target.value,
// 											payload,
// 											item.payload
// 										)
// 									}
// 									onSelect={(val) =>
// 										handleFilterInput(
// 											val,
// 											payload,
// 											item.payload
// 										)
// 									}
// 									renderItem={(content) => (
// 										<div>{content}</div>
// 									)}
// 									renderMenu={(items) => (
// 										<div
// 											className="autocomplete"
// 											children={items}
// 										/>
// 									)}
// 									renderInput={(props) => (
// 										<input
// 											disabled={
// 												currentInput[payload].disabled
// 											}
// 											{...props}
// 										/>
// 									)}
// 									onMenuVisibilityChange={() =>
// 										fetchKeys(payload, currentKey)
// 									}
// 								/>
// 							) : (
// 								<Autocomplete
// 									getItemValue={(value) => value}
// 									items={autocomplete[payload].values}
// 									value={currentVal}
// 									onChange={(e) =>
// 										handleFilterInput(
// 											e.target.value,
// 											payload,
// 											item.payload
// 										)
// 									}
// 									onSelect={(val) =>
// 										handleFilterInput(
// 											val,
// 											payload,
// 											item.payload
// 										)
// 									}
// 									renderItem={(content) => (
// 										<div>{content.substring(0, 70)}</div>
// 									)}
// 									renderMenu={(items, index) => (
// 										<div
// 											key={index}
// 											className="autocomplete"
// 											children={items}
// 										/>
// 									)}
// 									renderInput={(props) => (
// 										<input
// 											disabled={!currentKey}
// 											{...props}
// 										/>
// 									)}
// 									onMenuVisibilityChange={() =>
// 										fetchValues(
// 											payload,
// 											currentKey,
// 											currentVal
// 										)
// 									}
// 								/>
// 							)}
// 						</Fragment>
// 					)
// 				})}
// 			{currentInput[payload].key &&
// 				currentInput[payload].value && (
// 					<div className="filter-input-btns">
// 						<button
// 							type="button"
// 							className="add-filter-btn"
// 							onClick={() => addInputField(payload)}
// 						>
// 							Add
//             </button>
// 						<button
// 							type="button"
// 							onClick={() => clearFilter(payload)}
// 						>
// 							Remove
//             </button>
// 					</div>
// 				)}
// 		</div>)
// }
