// material-ui
import { styled } from "@mui/material/styles";

// project import
import ComponentSkeleton from "./ComponentSkeleton";
import MainCard from "components/MainCard";
import { DataGrid } from "@mui/x-data-grid";
import { Card as CardANTD, Spin } from "antd";
import {
  Col,
  Collapse,
  Form,
  Row,
  Upload,
  Select,
} from "../../../node_modules/antd/lib/index";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  Grid,
  Modal,
  Stack,
  NativeSelect,
  Select as SelectMui,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  MenuItem,
  CardActions,
} from "../../../node_modules/@mui/material/index";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { notification, Image, Space, Popconfirm } from "antd";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "actions/auth";
import { getInitialData } from "actions/initialData";
import { Tabs } from "antd";
import {
  createInfoProduct,
  getDataFilterInfoProduct,
  deleteInfoProductById,
  updateInfoProduct,
  getInfoProducts,
} from "actions/infoProduct";
import { PlusOutlined } from "@ant-design/icons";
import { object } from "prop-types";
const { TabPane } = Tabs;
// styles
const IFrameWrapper = styled("iframe")(() => ({
  height: "calc(100vh - 210px)",
  border: "none",
}));

// ============================|| Info Product Page ||============================ //

const InfoProductPage = () => {
  const { Option } = Select;
  const dispatch = useDispatch();
  const [searchModel, setSearchModel] = useState({
    TypeInfo: "",
  });
  const navigate = useNavigate();
  useEffect(() => {
    const listScreen = JSON.parse(localStorage.getItem("screenrole"));
    let obj = listScreen.find((o) => o.screenSlug === "/infoProduct");
    console.log("obj", obj);
    if (!obj) {
      navigate("/404");
    }
  }, []);
  const tag = useSelector((state) => state.tag);
  const [open, setOpen] = useState(false);
  const text = "B???n c?? ch???c ch???n mu???n xo???";
  const [loading, setLoading] = useState(false);
  const [infoInPage, setInfoInPage] = useState([]);
  const [type, setType] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [name, setName] = useState("");
  const [typeInfo, setTypeInfo] = useState("");
  useEffect(() => {
    setLoading(true);
    dispatch(getDataFilterInfoProduct()).then((data) => {
      data.map((item, index) => (item.id = index + 1));
      setInfoInPage(data);
      setLoading(false);
    });
    dispatch(getInfoProducts());
  }, [dispatch]);
  const columns = [
    { field: "_id", headerName: "M?? th??ng tin s???n ph???m", width: 250 },
    { field: "name", headerName: "Th??ng tin", width: 150 },
    {
      field: "type",
      headerName: "Lo???i th??ng tin",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="rowitem" style={{ textAlign: "center" }}>
            {params.row.type === "ram"
              ? "RAM"
              : params.row.type === "cpu"
              ? "CPU"
              : params.row.type === "mausac"
              ? "M??u s???c"
              : params.row.type === "manhinh"
              ? "M??n h??nh"
              : ""}
          </div>
        );
      },
    },
  ];
  // eslint-disable-next-line
  const [selectedRows, setSelectedRows] = useState([]);
  const handleView = () => {
    if (selectedRows.length === 0) {
      notification["warning"]({
        message: "Xem th??ng tin",
        description: "Vui l??ng ch???n th??ng tin b???n mu???n xem.",
      });
    } else if (selectedRows.length >= 2) {
      notification["warning"]({
        message: "Xem th??ng tin",
        description: "Vui l??ng ch??? ch???n m???t th??ng tin.",
      });
    } else {
      setType("view");
      handleOpen();
    }
  };
  const handleCreate = () => {
    setType("create");
    setName("");
    setTypeInfo("");
    handleOpen();
  };

  const confirm = () => {
    if (selectedRows.length === 0) {
      notification["warning"]({
        message: "Xo?? th??ng tin",
        description: "Vui l??ng ch???n th??ng tin b???n mu???n xo??.",
      });
    } else {
      let listInfo = [];
      selectedRows.map((item) => {
        listInfo.push(item._id);
      });
      const payload = {
        infoProductId: listInfo,
      };
      dispatch(deleteInfoProductById(payload)).then((data) => {
        dispatch(getDataFilterInfoProduct()).then((data) => {
          data.map((item, index) => (item.id = index + 1));
          setInfoInPage(data);
          setLoading(false);
        });
        if (data === "success") {
          notification["success"]({
            message: "Xo?? th??ng tin",
            description: "Xo?? th??ng tin th??nh c??ng.",
          });
        } else {
          notification["error"]({
            message: "Xo?? th??ng tin",
            description: "Xo?? th??ng tin kh??ng th??nh c??ng.",
          });
        }
      });
    }
  };
  const gridStyle = {
    width: "50%",
    height: "80px",
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1000,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    zIndex: 50,
    p: 4,
  };
  notification.config({
    placement: "topRight",
    top: 80,
    duration: 3,
    rtl: false,
    zIndex: 100,
  });
  const handleChangeType = (value) => {
    searchModel.TypeInfo = value;
    setSearchModel(searchModel);
  };
  const handleSearch = () => {
    setLoading(true);
    dispatch(getDataFilterInfoProduct(searchModel)).then((data) => {
      data.map((item, index) => (item.id = index + 1));
      setInfoInPage(data);
      setLoading(false);
    });
  };

  const handleEditInfo = () => {
    if (selectedRows.length === 0) {
      notification["warning"]({
        message: "Ch???nh s???a th??ng tin",
        description: "Vui l??ng ch???n th??ng tin b???n mu???n ch???nh s???a.",
      });
    } else if (selectedRows.length >= 2) {
      notification["warning"]({
        message: "Xem th??ng tin",
        description: "Vui l??ng ch??? ch???n m???t th??ng tin.",
      });
    } else {
      setType("edit");
      handleOpen();
    }
  };

  const handleAddInfo = async () => {
    if (name.trim() === "" || typeInfo === "") {
      notification["warning"]({
        message: "Th??m m???i th??ng tin",
        description: "Vui l??ng nh???p d??? li???u.",
      });
      return;
    }
    try {
      const data = {
        name,
        typeInfo,
      };
      dispatch(createInfoProduct(data)).then((data) => {
        dispatch(getDataFilterInfoProduct()).then((data) => {
          data.map((item, index) => (item.id = index + 1));
          setInfoInPage(data);
          setLoading(false);
        });
        if (data === "success") {
          handleClose();
          notification["success"]({
            message: "Th??m m???i th??ng tin",
            description: "Th??m m???i th??ng tin th??nh c??ng.",
          });
        } else {
          handleClose();
          notification["error"]({
            message: "Th??m m???i th??ng tin",
            description: "Th??m m???i th??ng tin th???t b???i.",
          });
        }
      });
    } catch (err) {
      throw new Error("Something went wrong");
    }
  };
  const handleUpdateInfo = async (e) => {
    try {
      const data = {
        _id: selectedRows[0]._id,
        name,
        typeInfo,
      };
      dispatch(updateInfoProduct(data)).then((data) => {
        dispatch(getDataFilterInfoProduct()).then((data) => {
          data.map((item, index) => (item.id = index + 1));
          setInfoInPage(data);
          setLoading(false);
        });
        if (data === "success") {
          handleClose();
          notification["success"]({
            message: "C???p nh???p th??ng tin",
            description: "C???p nh???p th??ng tin th??nh c??ng.",
          });
        } else {
          handleClose();
          notification["error"]({
            message: "C???p nh???p th??ng tin",
            description: "C???p nh???p th??ng tin th???t b???i.",
          });
        }
      });
    } catch (err) {
      throw new Error("Something went wrong");
    }
  };
  function removeDuplicates(startArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in startArray) {
      lookupObject[startArray[i][prop]] = startArray[i];
    }

    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }

  // Filter User
  var filterArrayType = removeDuplicates(infoInPage, "type");
  const modalInfoProduct = (type) => {
    let title;
    let disable;
    let Setonclick;
    if (type === "edit") {
      title = "Ch???nh s???a th??ng tin";
      disable = false;
      Setonclick = handleUpdateInfo;
    } else if (type === "view") {
      title = "Xem chi ti???t th??ng tin";
      disable = true;
    } else if (type === "create") {
      title = "T???o m???i th??ng tin";
      disable = false;
      Setonclick = handleAddInfo;
    }
    return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h3" component="h2">
            {title}
          </Typography>
          <Tabs
            defaultActiveKey="1"
            style={{ color: "black", fontSize: "19px" }}
          >
            <TabPane tab={<span>Th??ng tin chung</span>} key="1">
              <div
                className="container_infoOfProduct"
                style={{
                  display: "flex",
                  paddingTop: "0px",
                  color: "black",
                  fontSize: "17px",
                }}
              >
                <div
                  className="container_form_infoOfProduct"
                  style={{
                    paddingBottom: "20px",
                    width: "100%",
                    paddingRight: "30px",
                  }}
                >
                  <TextField
                    required
                    id="outlined-number"
                    label="Th??ng tin"
                    style={{ width: "100%", marginBottom: "15px" }}
                    value={name ? name : ""}
                    disabled={disable}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {/* <TextField
                                        required
                                        id="outlined-number"
                                        label="Lo???i th??ng tin"
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        value={typeInfo ? typeInfo : ''}
                                        disabled={disable}
                                        onChange={(e) => setTypeInfo(e.target.value)}
                                    /> */}
                  <FormControl style={{ width: "100%", marginBottom: "15px" }}>
                    <InputLabel
                      id="demo-simple-select-label"
                      disabled={disable}
                    >
                      Lo???i th??ng tin
                    </InputLabel>
                    <SelectMui
                      disabled={disable}
                      value={typeInfo ? typeInfo : ""}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      onChange={(e) => setTypeInfo(e.target.value)}
                    >
                      <MenuItem value={"ram"}>Ram</MenuItem>
                      <MenuItem value={"cpu"}>CPU</MenuItem>
                      <MenuItem value={"mausac"}>M??u s???c</MenuItem>
                      <MenuItem value={"manhinh"}>M??n h??nh</MenuItem>
                    </SelectMui>
                  </FormControl>
                </div>
              </div>
            </TabPane>
          </Tabs>
          <CardActions sx={{ padding: "0" }}>
            <Button
              size="small"
              variant="outlined"
              color="success"
              onClick={Setonclick}
              disabled={disable}
            >
              L??u
            </Button>
            <Button size="small" variant="outlined" onClick={handleClose}>
              ????ng
            </Button>
          </CardActions>
        </Box>
      </Modal>
    );
  };
  return (
    <ComponentSkeleton>
      <Form style={{ marginBottom: "10px" }}>
        <Collapse
          defaultActiveKey={["1"]}
          expandIconPosition={"right"}
          className="mps-search-header-collapse"
        >
          <Collapse.Panel
            header={
              <span className="mps-search-header-panel-title">
                {" "}
                Th??ng tin t??m ki???m
              </span>
            }
            key="1"
          >
            <CardANTD style={{ border: "none" }}>
              <CardANTD.Grid style={gridStyle}>
                <Row>
                  <Col span={8}>
                    <Form.Item>Lo???i th??ng tin</Form.Item>
                  </Col>
                  <Col span={16}>
                    <Form.Item>
                      <Select
                        mode="multiple"
                        optionFilterProp="data"
                        optionLabelProp="text"
                        onChange={handleChangeType}
                      >
                        {filterArrayType.map((item) => (
                          <Option
                            key={item.type}
                            data={item.type}
                            text={
                              item.type === "ram"
                                ? "RAM"
                                : item.type === "mausac"
                                ? "M??u s???c"
                                : item.type === "manhinh"
                                ? "M??n h??nh"
                                : item.type === "cpu"
                                ? "CPU"
                                : null
                            }
                          >
                            <div className="global-search-item">
                              <span>
                                {item.type === "ram"
                                  ? "RAM"
                                  : item.type === "mausac"
                                  ? "M??u s???c"
                                  : item.type === "manhinh"
                                  ? "M??n h??nh"
                                  : item.type === "cpu"
                                  ? "CPU"
                                  : null}
                              </span>
                            </div>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </CardANTD.Grid>
            </CardANTD>
          </Collapse.Panel>
        </Collapse>
      </Form>
      <MainCard>
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
          sx={{ marginBottom: "20px" }}
        >
          <Button
            variant="outlined"
            onClick={handleSearch}
            startIcon={<SearchIcon />}
            style={{ cursor: "pointer" }}
          >
            T??m ki???m
          </Button>
          <Button
            variant="outlined"
            style={{ cursor: "pointer" }}
            onClick={handleView}
          >
            Xem
          </Button>
          <Button
            variant="outlined"
            onClick={handleCreate}
            color="success"
            startIcon={<AddIcon />}
            style={{ cursor: "pointer" }}
          >
            Th??m m???i
          </Button>
          <Popconfirm
            placement="right"
            title={text}
            onConfirm={confirm}
            okText="?????ng ??"
            cancelText="Kh??ng"
          >
            <Button
              variant="outlined"
              color="error"
              style={{ cursor: "pointer" }}
              startIcon={<DeleteIcon />}
              // onClick={handleDeleteProduct}
            >
              Xo??
            </Button>
          </Popconfirm>
          <Button
            variant="outlined"
            style={{ cursor: "pointer" }}
            onClick={handleEditInfo}
          >
            Ch???nh s???a
          </Button>
        </Stack>
        {modalInfoProduct(type)}
        <Grid container spacing={3}>
          <div style={{ height: 600, width: "100%", marginLeft: "10px" }}>
            <DataGrid
              rows={infoInPage.length !== 0 ? infoInPage : []}
              columns={infoInPage.length !== 0 ? columns : []}
              pageSize={8}
              rowsPerPageOptions={[8]}
              checkboxSelection
              getRowId={(row) => row._id}
              onSelectionModelChange={(ids) => {
                const selectedIDs = new Set(ids);
                const selectedRows = infoInPage.filter((row) =>
                  selectedIDs.has(row._id)
                );
                if (selectedRows.length === 1) {
                  setName(selectedRows[0].name);
                  setTypeInfo(selectedRows[0].typeInfo);
                }
                setSelectedRows(selectedRows);
              }}
              loading={loading}
            />
          </div>
        </Grid>
      </MainCard>
    </ComponentSkeleton>
  );
};

export default InfoProductPage;
