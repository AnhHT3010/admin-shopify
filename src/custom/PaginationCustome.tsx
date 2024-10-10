// PaginationCustome.tsx
import { Stack } from "@mui/material";
import { Pagination, Select, Text } from "@shopify/polaris";
import React from "react";

interface PaginationCustomeProps {
  currentPage: number;
  itemsPerPage: number;
  filteredProducts: unknown[];
  setItemsPerPage: (value: number) => void;
  setCurrentPage: (value: number) => void;
  paginationOptions: {
    label: string;
    value: string;
  }[];
}

const PaginationCustome: React.FC<PaginationCustomeProps> = ({
  currentPage,
  itemsPerPage,
  filteredProducts,
  setItemsPerPage,
  setCurrentPage,
  paginationOptions,
}) => {
  const indexOfLastItem = currentPage * itemsPerPage;

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      mt={2}
      fontSize="1.2rem"
    >
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        className="flex"
        gap={2}
      >
        <Text variant="headingXs" as="h6">
          Hiển thị: {itemsPerPage * (currentPage - 1) + 1}/
          {indexOfLastItem > filteredProducts.length
            ? filteredProducts.length
            : indexOfLastItem}{" "}
          Tổng: {filteredProducts.length} bản ghi
        </Text>
        <Select
          label=""
          options={paginationOptions}
          onChange={(value) => setItemsPerPage(Number(value))}
          value={String(itemsPerPage)}
        />
      </Stack>
      <Text variant="headingXs" as="h6">
        Trang: {currentPage}
      </Text>
      <Pagination
        hasPrevious={currentPage > 1}
        onPrevious={() => setCurrentPage(currentPage - 1)}
        hasNext={indexOfLastItem < filteredProducts.length}
        onNext={() => setCurrentPage(currentPage + 1)}
      />
    </Stack>
  );
};

export default PaginationCustome;
