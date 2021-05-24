import React, { useEffect, useState, useCallback } from 'react'
import { EXPERIMENTAL_Table as Table, EXPERIMENTAL_useTableMeasures as useTableMeasures } from 'vtex.styleguide'
import {useModal} from '../hooks/modalProvider'

interface IProps {
  needsModal?: boolean
  rowsOptions?: number[],
  loading: boolean,
  itemsList: any,
  columns: {
    id: string,
    title: string
  }[],
}

const TableRefactured: React.FC<IProps> = ({ needsModal=false, loading, itemsList, columns, rowsOptions = [10, 15, 20] }) => {
  const {onOpen, onUserCall}= useModal()

  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(rowsOptions[0])

  const [currentItemFrom, setCurrentItemFrom] = useState(1)
  const [currentItemTo, setCurrentItemTo] = useState(perPage)

  const [slicedOrdersList, setSlicedOrdersList] = useState<any[]>([])

  console.log(slicedOrdersList)

  useEffect(() => {
    const firstSlice = itemsList.slice(currentItemFrom - 1, currentItemTo)
    setSlicedOrdersList(firstSlice)
    console.log('rodei o first slice')
  }, [itemsList])

  const handleNextClick = useCallback(() => {

    setCurrentPage(currentPage + 1)
    setCurrentItemFrom(currentItemTo + 1)
    setCurrentItemTo(perPage * (currentPage + 1))
    const slicedOrdersListSetter = itemsList.slice(currentItemTo, perPage * (currentPage + 1))
    setSlicedOrdersList(slicedOrdersListSetter)

  }, [currentPage, currentItemTo, currentItemFrom, perPage, itemsList])

  const handlePrevClick = useCallback(() => {
    if (currentPage === 1) return

    setCurrentPage(currentPage - 1)
    setCurrentItemFrom(currentItemFrom - perPage)
    setCurrentItemTo(currentItemFrom - 1)
    const slicedOrdersListSetter = itemsList.slice(currentItemFrom - perPage - 1, currentItemFrom - 1)
    setSlicedOrdersList(slicedOrdersListSetter)

  }, [currentPage, currentItemTo, currentItemFrom, perPage, itemsList])

  const handleRowsChange = useCallback((e, value: string) => {
    const valueNumber = Number(value)

    const whichPageAmI = Math.ceil(currentItemFrom / valueNumber)
    setCurrentPage(whichPageAmI)

    const newCurrentItemFrom = ((whichPageAmI - 1) * valueNumber) + 1
    setCurrentItemFrom(newCurrentItemFrom)
    setCurrentItemTo(whichPageAmI * valueNumber)
    setPerPage(valueNumber)
    const slicedOrdersListSetter = itemsList.slice(newCurrentItemFrom - 1, whichPageAmI * valueNumber)
    setSlicedOrdersList(slicedOrdersListSetter)
  }, [currentItemFrom, itemsList])

  const measures = useTableMeasures({ size: perPage })

  const pagination = {
    onNextClick: () => handleNextClick(),
    onPrevClick: () => handlePrevClick(),
    currentItemFrom: currentItemFrom,
    currentItemTo: currentItemTo,
    onRowsChange: handleRowsChange,
    textShowRows: 'Show rows',
    textOf: 'of',
    totalItems: itemsList.length,
    rowsOptions: rowsOptions,
  }

  return (
    <div className="mb5 mt5 w-100">
      <Table
        key={(new Date()).getTime()}
        loading={loading}
        measures={measures}
        columns={columns}
        items={slicedOrdersList}
        onRowClick={({ rowData }: any) => {
          /* alert(
            `you just clicked SKU ID ${rowData.skuId} from seller ${rowData.sellerIds} and delivered at postal code ${rowData.postalCode} by ${rowData.selectedSla}`
          ) */
          if(needsModal){
            onUserCall(rowData.email, rowData.type)
            onOpen()
          }
        }}
      >
        <Table.Pagination {...pagination} />
      </Table>
    </div>
  )

}

export default TableRefactured
