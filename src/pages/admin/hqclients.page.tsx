import { useEffect, useState } from "react";
import {
  Stack,
  Box,
  Container,
  Autocomplete,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
} from "@mui/material";

import {
  countries,
  StyledTableCell,
  StyledTableRow,
  TablePaginationActions,
} from "./hqcenters.page";

import { useLazyGetCentersQuery } from "../../redux/api/centerApi";

import CenterModal from "../../components/modals/center.modal";

const HQClientsPage = () => {
  const [openCenter, setOpenCenter] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [country, setCountry] = useState("");
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");

  const [getClients, getState] = useLazyGetCentersQuery();

  useEffect(() => {
    getClients({ page, rowsPerPage, country, level, search });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, country, level, search, rowsPerPage]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = !getState.data
    ? rowsPerPage
    : page > 0
    ? Math.max(0, (1 + page) * rowsPerPage - getState.data.filtered_counts)
    : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Container sx={{ mt: 20 }}>
        <Stack
          flexDirection="row"
          mt={2}
          justifyContent="space-between"
          flexWrap="wrap"
          gap={3}
        >
          <Autocomplete
            id="country-select-demo"
            sx={{ width: 300 }}
            options={countries}
            autoHighlight
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) =>
              option.code === "" ? (
                <Box component="li" {...props}>
                  All
                </Box>
              ) : (
                <Box
                  component="li"
                  sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                  {...props}
                >
                  <img
                    loading="lazy"
                    width="20"
                    src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                    srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                    alt=""
                  />
                  {option.label}
                </Box>
              )
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Choose a country"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: "new-password", // disable autocomplete and autofill
                }}
              />
            )}
            onChange={(event, value) => {
              if (value) setCountry(value.label);
            }}
          />

          <Box display="flex" gap={3} flexWrap="wrap">
            <Box width={288}>
              <FormControl fullWidth>
                <InputLabel id="level-name-label">Level</InputLabel>
                <Select
                  labelId="level-name-label"
                  id="level-name-select"
                  label="Level"
                  defaultValue=""
                  onChange={(event) => {
                    setLevel(event.target.value);
                  }}
                >
                  <MenuItem value="bronze">Bronze</MenuItem>
                  <MenuItem value="silver">Silver</MenuItem>
                  <MenuItem value="gold">Gold</MenuItem>
                  <MenuItem value="platinum">Platinum</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TextField
              label="Search"
              onChange={(event) => {
                setSearch(event.target.value);
              }}
            />
          </Box>
        </Stack>
        <Box
          display="flex"
          justifyContent="space-between"
          mt={4}
          px={{ md: 4 }}
        >
          <Typography>
            CENTERS{" "}
            <Box component="span" color="primary.main" fontSize={25} ml={3}>
              {getState.data?.total_counts.toLocaleString()}
            </Box>
          </Typography>
          <Button variant="contained" onClick={() => setOpenCenter(true)}>
            NEW CENTER
          </Button>
        </Box>
        <TableContainer sx={{ px: 4, mt: 3 }}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>CENTER ID</StyledTableCell>
                <StyledTableCell align="center">CITY, COUNTRY</StyledTableCell>
                <StyledTableCell align="center">
                  REFERER CENTER ID
                </StyledTableCell>
                <StyledTableCell align="center">LEVEL</StyledTableCell>
                <StyledTableCell align="center">PURCHASES</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getState.data?.centers &&
                getState.data.centers.map((row, index) => (
                  <StyledTableRow key={`table_row_${index}`}>
                    <StyledTableCell component="th" scope="row">
                      {row.center_id}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {`${row.address.city} ${row.address.country}`}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.referer_center_id}
                    </StyledTableCell>
                    <StyledTableCell align="center"></StyledTableCell>
                    <StyledTableCell align="center"></StyledTableCell>
                  </StyledTableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={5}
                  count={!getState.data ? 0 : getState.data.filtered_counts}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Container>
      <CenterModal open={openCenter} setOpen={setOpenCenter} />
    </>
  );
};

export default HQClientsPage;
