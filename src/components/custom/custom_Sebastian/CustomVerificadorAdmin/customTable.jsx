import React, { useMemo, useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/react";

import CustomPagination from "@/components/custom/customPagination";

export default function CustomTable({
  columns,
  data = [],
  classNames,
  searchTerm = "",
  searchFields = [],
  isPaginated = true,
  rowsPerPageProp = 10,
  showRowsPerPage = false,
  visibleColumns, // Nuevo prop para controlar columnas visibles (Set o array de keys)
}) {
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "",
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageProp);

  // Filtrar columnas visibles si se provee visibleColumns
  const filteredColumns = useMemo(() => {
    if (!visibleColumns) return columns;
    // visibleColumns puede ser Set o array
    const visibleSet = Array.isArray(visibleColumns) ? new Set(visibleColumns) : visibleColumns;
    return columns.filter((col) => visibleSet.has(col.key));
  }, [columns, visibleColumns]);

  // Filtrar datos según el término de búsqueda y los campos de búsqueda
  const filteredData = useMemo(() => {
    const safeData = Array.isArray(data) ? data : [];
    if (!searchTerm || searchFields.length === 0) return safeData;

    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return safeData.filter((item) =>
      searchFields.some((field) =>
        item[field]?.toString().toLowerCase().includes(lowercasedSearchTerm)
      )
    );
  }, [data, searchTerm, searchFields]);

  // Lógica de ordenamiento
  const sortedData = useMemo(() => {
    if (!sortDescriptor.column) return [...filteredData];

    const sorted = [...filteredData];
    const column = filteredColumns.find((col) => col.key === sortDescriptor.column);
    if (!column) return sorted;

    sorted.sort((a, b) => {
      const getCellValue = (item, col) => {
        const keys = col.key.split(".");
        let value = item;
        for (const key of keys) {
          value = value && value[key] !== undefined ? value[key] : "";
        }

        if (col.type === "numeric" && value !== "") {
          return value;
        }

        if (col.renderCell) {
          const rendered = col.renderCell(item);
          if (rendered?.props?.children) {
            if (typeof rendered.props.children === "string") {
              return rendered.props.children;
            }
            if (React.isValidElement(rendered)) {
              const extractText = (element) => {
                if (typeof element === "string") return element;
                if (Array.isArray(element)) {
                  return element.map(extractText).join("");
                }
                if (React.isValidElement(element)) {
                  return extractText(element.props.children);
                }
                return "";
              };
              return extractText(rendered);
            }
          }
          return value;
        }
        return value;
      };

      let valA = getCellValue(a, column);
      let valB = getCellValue(b, column);

      if (column.type === "numeric") {
        valA = parseFloat(valA) || 0;
        valB = parseFloat(valB) || 0;
        return sortDescriptor.direction === "ascending"
          ? valA - valB
          : valB - valA;
      } else if (column.type === "text") {
        valA = (valA === null || valA === undefined) ? "" : valA.toString();
        valB = (valB === null || valB === undefined) ? "" : valB.toString();
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
        return sortDescriptor.direction === "ascending"
          ? valA.localeCompare(valB, "es", { sensitivity: "base" })
          : valB.localeCompare(valA, "es", { sensitivity: "base" });
      } else if (column.sortFunction) {
        return sortDescriptor.direction === "ascending"
          ? column.sortFunction(a, b)
          : -column.sortFunction(a, b);
      }

      return 0;
    });

    return sorted;
  }, [filteredData, sortDescriptor, filteredColumns]);

  // Datos paginados
  const currentData = useMemo(() => {
    if (!isPaginated) return sortedData;
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedData.slice(start, end);
  }, [currentPage, sortedData, rowsPerPage, isPaginated]);

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-4">
        <p>No hay datos disponibles.</p>
      </div>
    );
  }

  return (
    <>
      <Table
        aria-label="Tabla personalizada"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        classNames={classNames}
      >
        <TableHeader>
          {filteredColumns.map((column) => (
            <TableColumn
              key={column.key}
              allowsSorting={column.sortable}
              className={column.className}
              width={column.width}
            >
              {column.label}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody emptyContent="No se encontraron datos">
          {currentData.map((item, index) => (
            <TableRow key={item.id || index}>
              {filteredColumns.map((column) => (
                <TableCell key={column.key}>
                  {column.renderCell
                    ? column.renderCell(item)
                    : item[column.key] || "-"}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CustomPagination
        className="py-4"
        totalRecords={sortedData.length}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isPaginated={isPaginated}
        showRowsPerPage={showRowsPerPage}
        paginationColors={{
          cursor: classNames?.th?.split(" ").find((c) => c.startsWith("bg-")) || "bg-verdeVeci",
          item: (() => {
            const thBg = classNames?.th?.split(" ").find((c) => c.startsWith("bg-"));
            return thBg ? `${thBg}/10` : "bg-verdeVeci/10";
          })(),
        }}
      />
    </>
  );
}
