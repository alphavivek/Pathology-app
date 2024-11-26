/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// BaseURL Fetch
import { BaseURl } from "config/BaseURL";

function DataTableBodyCell({ noBorder, align, children }) {
  const [data, setData] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const suggestionsPerPage = 5;

  useEffect(() => {
    const fetchReferals = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BaseURl}users`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const refers = await response.json();
        setData(refers.data);
        console.log("refers ", refers);
        console.log("refers ", refers.data);
      } catch (error) {
        console.error("Failed to fetch refers:", error);
      }
    };

    fetchReferals();
  }, []);

  const handleInputChange = (e) => {
    const { value } = e.target;
    if (value.length > 0) {
      const filtered = data.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()));
      setShowSuggestions(true);
      setFilteredSuggestions(filtered);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelect = (item) => {
    console.log("Selected item:", item);
    setShowSuggestions(false);
  };

  const paginate = (array, page_number) => {
    return array.slice((page_number - 1) * suggestionsPerPage, page_number * suggestionsPerPage);
  };

  return (
    <MDBox
      component="td"
      textAlign={align}
      py={1.5}
      px={3}
      sx={({ palette: { light }, typography: { size }, borders: { borderWidth } }) => ({
        fontSize: size.sm,
        borderBottom: noBorder ? "none" : `${borderWidth[1]} solid ${light.main}`,
      })}
    >
      <MDBox
        display="inline-block"
        width="max-content"
        color="text"
        sx={{ verticalAlign: "middle" }}
      >
        {children}
        <input
          type="text"
          onChange={handleInputChange}
          className="w-full border-2 border-gray-300 p-2 rounded focus:ring-2 focus:ring-teal-400 transition-all duration-300"
        />
        {showSuggestions && filteredSuggestions.length > 0 && (
          <ul className="absolute bg-white border border-gray-300 w-full mt-2 rounded-lg shadow-md">
            {paginate(filteredSuggestions, currentPage).map((item, idx) => (
              <li
                key={idx}
                onClick={() => handleSelect(item)}
                className="p-2 hover:bg-teal-400 hover:text-white cursor-pointer"
              >
                {item.name}
              </li>
            ))}
            <div className="flex justify-between mt-2">
              {currentPage > 1 && (
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="text-sm text-teal-600 hover:underline"
                >
                  Previous
                </button>
              )}
              {filteredSuggestions.length > currentPage * suggestionsPerPage && (
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="text-sm text-teal-600 hover:underline"
                >
                  Next
                </button>
              )}
            </div>
          </ul>
        )}
      </MDBox>
    </MDBox>
  );
}

// Setting default values for the props of DataTableBodyCell
DataTableBodyCell.defaultProps = {
  noBorder: false,
  align: "left",
};

// Typechecking props for the DataTableBodyCell
DataTableBodyCell.propTypes = {
  children: PropTypes.node.isRequired,
  noBorder: PropTypes.bool,
  align: PropTypes.oneOf(["left", "right", "center"]),
};

export default DataTableBodyCell;
