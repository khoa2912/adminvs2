// material-ui
import { styled } from "@mui/material/styles";

// project import
import ComponentSkeleton from "./ComponentSkeleton";
import MainCard from "components/MainCard";
import { Card as CardANTD, Spin } from "antd";
import {
  Col,
  Collapse,
  Form,
  Row,
  Upload,
  Select,
  message,
} from "../../../node_modules/antd/lib/index";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Divider,
  Grid,
  Modal,
  Stack,
  Typography,
  TextField,
  NativeSelect,
  FormControl,
  InputLabel,
  Select as SelectMui,
  OutlinedInput,
  MenuItem,
  CardActions,
} from "../../../node_modules/@mui/material/index";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { notification, Space, Popconfirm } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInitialData } from "actions/initialData";
import { Tabs } from "antd";
import {
  addScreen,
  getDataFilterScreen,
  deleteScreenById,
  updateScreen,
} from "actions/screen";
import { getActions } from "actions/action";
import { useNavigate } from "react-router-dom";
import moment from "../../../node_modules/moment/moment";
const { TabPane } = Tabs;
// styles
const IFrameWrapper = styled("iframe")(() => ({
  height: "calc(100vh - 210px)",
  border: "none",
}));
// ============================|| COMPONENT - ListScreenPage ||============================ //

const ListScreenPage = () => {
  const { Option } = Select;
  const dispatch = useDispatch();
  const [searchModel, setSearchModel] = useState({
    Screen_Name: "",
  });
  const { TabPane } = Tabs;
  const [loading, setLoading] = useState(false);
  const [screenInPage, setScreenInPage] = useState([]);
  const [actionInPage, setActionInPage] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const listScreen = JSON.parse(localStorage.getItem("screenrole"));
    let obj = listScreen.find((o) => o.screenSlug === "/listscreen");
    console.log("obj", obj);
    if (!obj) {
      navigate("/404");
    }
  }, []);
  const text = "B???n c?? ch???c ch???n mu???n xo???";
  const [type, setType] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [screenName, setScreenName] = useState("");
  const [screenSlug, setScreenSlug] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [listAction, setListAction] = useState([]);

  useEffect(() => {
    setLoading(true);
    dispatch(getDataFilterScreen()).then((data) => {
      data.map((item, index) => (item.id = index + 1));
      setScreenInPage(data);
      setLoading(false);
    });
    dispatch(getActions()).then((data) => {
      data.map((item, index) => (item.id = index + 1));
      setActionInPage(data);
    });
  }, [dispatch]);
  const columns = [
    { field: "id", headerName: "STT", width: 100 },
    // { field: 'screenCode', headerName: 'M?? Screen', width: 130 },
    { field: "screenName", headerName: "T??n Screen", width: 200 },
    { field: "screenSlug", headerName: "Slug", width: 200 },
    {
      field: "updatedTime",
      headerName: "Ng??y c???p nh???p",
      width: 200,
      renderCell: (params) => (
        <div>{moment(params.value).format("HH:MM DD/MM/YYYY")}</div>
      ),
    },
  ];
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
    p: 4,
  };
  notification.config({
    placement: "topRight",
    top: 80,
    duration: 3,
    rtl: false,
  });
  const handleChangeScreenName = (value) => {
    searchModel.Screen_Name = value;
    setSearchModel(searchModel);
  };
  const handleChangeDescription = (value) => {
    searchModel.Description = value;
    setSearchModel(searchModel);
  };

  // Filter in Screen
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

  // Filter Screen name
  var filterArrayScreen = removeDuplicates(screenInPage, "screenName");
  const handleView = () => {
    if (selectedRows.length === 0) {
      notification["warning"]({
        message: "Xem Screen",
        description: "Vui l??ng ch???n Screen b???n mu???n xem.",
      });
    } else if (selectedRows.length >= 2) {
      notification["warning"]({
        message: "Xem Screen",
        description: "Vui l??ng ch??? ch???n m???t Screen.",
      });
    } else {
      setType("view");
      handleOpen();
    }
  };

  const handleCreate = () => {
    setType("create");
    setScreenName("");
    setScreenSlug("");
    setListAction([]);
    handleOpen();
  };
  const handleAddScreen = async (e) => {
    if (screenName.trim() === "") {
      notification["warning"]({
        message: "Th??m m???i screen",
        description: "Vui l??ng nh???p d??? li???u.",
      });
      return;
    }
    try {
      const data = {
        screenName,
        screenSlug,
        action: listAction,
        updatedTime: new Date(),
      };
      dispatch(addScreen(data)).then((data) => {
        dispatch(getDataFilterScreen()).then((data) => {
          data.map((item, index) => (item.id = index + 1));
          setScreenInPage(data);
          setLoading(false);
        });
        if (data === "success") {
          handleClose();
          notification["success"]({
            message: "Th??m m???i Screen",
            description: "Th??m m???i Screen th??nh c??ng.",
          });
        } else {
          handleClose();
          notification["error"]({
            message: "Th??m m???i Screen",
            description: "Th??m m???i Screen th???t b???i.",
          });
        }
      });
    } catch (err) {
      throw new Error("Something went wrong");
    }
  };

  const handleUpdateScreen = async (e) => {
    try {
      const data = {
        _id: selectedRows[0]._id,
        screenName,
        screenSlug,
        action: listAction,
        updatedTime: new Date(),
      };
      dispatch(updateScreen(data)).then((data) => {
        dispatch(getDataFilterScreen()).then((data) => {
          data.map((item, index) => (item.id = index + 1));
          setScreenInPage(data);
        });
        if (data === "success") {
          handleClose();
          notification["success"]({
            message: "Ch???nh s???a Screen",
            description: "Ch???nh s???a Screen th??nh c??ng.",
          });
        } else {
          handleClose();
          notification["error"]({
            message: "Ch???nh s???a Screen",
            description: "Ch???nh s???a Screen th???t b???i.",
          });
        }
      });
    } catch (err) {
      throw new Error("Something went wrong");
    }
  };
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const handleChangeAction = (e) => {
    const {
      target: { value },
    } = e;
    setListAction(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const handleSearch = () => {
    setLoading(true);
    dispatch(getDataFilterScreen(searchModel)).then((data) => {
      data.map((item, index) => (item.id = index + 1));
      setScreenInPage(data);
      setLoading(false);
    });
  };

  const handleEditScreen = () => {
    if (selectedRows.length === 0) {
      notification["warning"]({
        message: "Ch???nh s???a screen",
        description: "Vui l??ng ch???n screen b???n mu???n ch???nh s???a.",
      });
    } else if (selectedRows.length >= 2) {
      notification["warning"]({
        message: "Ch???nh s???a screen",
        description: "Vui l??ng ch??? ch???n m???t screen.",
      });
    } else {
      setType("edit");
      handleOpen();
    }
  };

  const confirm = () => {
    if (selectedRows.length === 0) {
      notification["warning"]({
        message: "Xo?? Screen",
        description: "Vui l??ng ch???n Screen b???n mu???n xo??.",
      });
    } else {
      let listIdScreen = [];
      selectedRows.map((item) => {
        listIdScreen.push(item._id);
      });
      const payload = {
        screenId: listIdScreen,
      };
      dispatch(deleteScreenById(payload)).then((data) => {
        dispatch(getDataFilterScreen()).then((data) => {
          data.map((item, index) => (item.id = index + 1));
          setScreenInPage(data);
          setLoading(false);
        });
        if (data === "success") {
          notification["success"]({
            message: "Xo?? Screen",
            description: "Xo?? Screen th??nh c??ng.",
          });
        } else {
          notification["error"]({
            message: "Xo?? Screen",
            description: "Xo?? Screen kh??ng th??nh c??ng.",
          });
        }
      });
    }
  };
  const modalScreen = (type) => {
    let title;
    let disable;
    let Setonclick;
    if (type === "edit") {
      title = "Ch???nh s???a Screen";
      disable = false;
      Setonclick = handleUpdateScreen;
    } else if (type === "create") {
      title = "Th??m m???i Screen";
      disable = false;
      Setonclick = handleAddScreen;
    } else if (type === "view") {
      title = "Xem chi ti???t Screen";
      disable = true;
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
                className="container_infoScreen"
                style={{
                  display: "flex",
                  paddingTop: "0px",
                  color: "black",
                  fontSize: "17px",
                }}
              >
                <div
                  className="container_form_infoScreen"
                  style={{
                    paddingBottom: "20px",
                    width: "100%",
                    paddingRight: "30px",
                  }}
                >
                  <TextField
                    required
                    style={{ width: "100%", marginBottom: "15px" }}
                    id="outlined-error"
                    label="T??n Screen"
                    value={screenName}
                    disabled={disable}
                    onChange={(e) => setScreenName(e.target.value)}
                  />
                  <TextField
                    required
                    style={{ width: "100%", marginBottom: "15px" }}
                    id="outlined-error"
                    label="Slug"
                    value={screenSlug}
                    disabled={disable}
                    onChange={(e) => setScreenSlug(e.target.value)}
                  />
                  <FormControl style={{ width: "100%", marginBottom: "15px" }}>
                    <InputLabel id="demo-multiple-checkbox-label">
                      Action
                    </InputLabel>
                    <SelectMui
                      // disabled={disable}
                      defaultValue={listAction ? listAction : null}
                      disabled={disable}
                      label="Action"
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      input={<OutlinedInput label="Action" />}
                      // renderValue={(selected) => selected.join(', ')}
                      MenuProps={MenuProps}
                      onChange={handleChangeAction}
                    >
                      {actionInPage.map((option) => (
                        <MenuItem value={option._id}>
                          {option.actionName}
                        </MenuItem>
                      ))}
                    </SelectMui>
                  </FormControl>
                </div>
              </div>
            </TabPane>
          </Tabs>
          <CardActions sx={{}}>
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
                    <Form.Item>T??n Screen</Form.Item>
                  </Col>
                  <Col span={16}>
                    <Form.Item>
                      <Select
                        mode="multiple"
                        optionFilterProp="data"
                        optionLabelProp="text"
                        onChange={handleChangeScreenName}
                      >
                        {filterArrayScreen.map((item) => (
                          <Option
                            key={item.screenName}
                            data={item.screenName}
                            text={item.screenName}
                          >
                            <div className="global-search-item">
                              <span>{item.screenName}</span>
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
            >
              Xo??
            </Button>
          </Popconfirm>
          <Button
            variant="outlined"
            style={{ cursor: "pointer" }}
            onClick={handleEditScreen}
          >
            Ch???nh s???a
          </Button>
        </Stack>
        {modalScreen(type)}
        <Grid container spacing={3}>
          <div style={{ height: 600, width: "100%", marginLeft: "10px" }}>
            <DataGrid
              rows={screenInPage.length !== 0 ? screenInPage : []}
              columns={screenInPage.length !== 0 ? columns : []}
              pageSize={8}
              rowsPerPageOptions={[8]}
              checkboxSelection
              getRowId={(row) => row._id}
              onSelectionModelChange={(ids) => {
                const selectedIDs = new Set(ids);
                const selectedRows = screenInPage.filter((row) =>
                  selectedIDs.has(row._id)
                );
                if (selectedRows.length === 1) {
                  setScreenName(selectedRows[0].screenName);
                  setScreenSlug(selectedRows[0].screenSlug);
                  setListAction(selectedRows[0].action);
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

export default ListScreenPage;
