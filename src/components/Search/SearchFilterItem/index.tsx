import React from "react"
// import { SearchFilterItemProps, SearchValue } from "../types"
// import { SearchAutocomplete } from "../SearchAutocomplete"
// import { sharedState } from "../../../configureService"
// import { checkForInputFilter } from "../util"
// import { FilterItem } from "../../../types"

// export const SearchFilterItem: React.FunctionComponent<{
//     value: SearchValue,
//     filter: FilterItem,
// }> = ({
//     value,add
//     filter,
// }) => {
//     const handleFilterChange = (
//       name: string,
//       title: string | { kind: string; count: number }
//     ): void => {
//       const valueInState = sharedState.get('search_value') || {}
//       const savedFilters = sharedState.get('saved_filters') || {}
//       if (valueInState[name] === title) {
//         delete valueInState[name]
//         sharedState.set('search_value', { ...valueInState })
//       }
//       savedFilters[name] && delete savedFilters[name]
//       sharedState.set('saved_filters', { ...savedFilters })
//       sharedState.set('search_value', { ...valueInState, [name]: title })
//     }
//     return (
//             <div className="inner-items">
//                 {checkForInputFilter(filter.payload) ? (
//                     // <SearchAutocomplete
//                     //     values={el.values}
//                     //     payload={el.payload}
//                     //     currentInput={currentInput}
//                     //     autocomplete={autocomplete}
//                     //     self={parent}
//                     // />
//                 ) : (
//                     el.values &&
//                     el.values.map((item) => (
//                         <button
//                             key={item.title}
//                             className={
//                                 value[el.payload] === item.payload
//                                     ? "selected-filter"
//                                     : ""
//                             }
//                             onClick={() =>
//                                 handleFilterChange(el.payload, item.payload)
//                             }
//                         >
//                             {item.title}
//                         </button>
//                     ))
//                 )}
//             </div>
//     )
// }
