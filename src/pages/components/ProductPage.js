import PropTypes from "prop-types";

// material-ui
import { Box, Card, Grid, Stack, Typography } from "@mui/material";

// project import
import ComponentSkeleton from "./ComponentSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
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
import { FormGroup } from "react-bootstrap";
import { EditorState, convertToRaw } from "draft-js";
import { PlusOutlined } from "@ant-design/icons";

import {
  Button,
  CardActions,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  Select as SelectMui,
  NativeSelect,
  MenuItem,
  Modal,
  OutlinedInput,
  TextField,
} from "../../../node_modules/@mui/material/index";
import { CKEditor } from "ckeditor4-react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { notification, Popconfirm, Result } from "antd";
import { Tabs } from "antd";
import "antd/dist/antd.css";
import formatThousand from "util/formatThousans";
import {
  deleteProductById,
  getDataFilterProduct,
  getProducts,
  getProductWarning,
  editProduct,
  getProductRelated,
} from "actions/product";
import { getAllCategory } from "actions/category";
import { getTags } from "actions/tag";
import { getInfoProducts } from "actions/infoProduct";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import {
  DataArraySharp,
  SettingsBackupRestoreSharp,
} from "../../../node_modules/@mui/icons-material/index";
import tag from "reducers/tag";
import { api } from "urlConfig";

// ===============================|| COLOR BOX ||=============================== //
const { TabPane } = Tabs;
const { Option } = Select;
function ColorBox({ bgcolor, title, data, dark, main }) {
  return (
    <>
      <Card sx={{ "&.MuiPaper-root": { borderRadius: "0px" } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 2.5,
            bgcolor,
            color: dark ? "grey.800" : "#ffffff",
            border: main ? "1px dashed" : "1px solid transparent",
          }}
        >
          {title && (
            <Grid container justifyContent="space-around" alignItems="center">
              <Grid item>
                {data && (
                  <Stack spacing={0.75} alignItems="center">
                    <Typography variant="subtitle2">{data.label}</Typography>
                    <Typography variant="subtitle1">{data.color}</Typography>
                  </Stack>
                )}
              </Grid>
              <Grid item>
                <Typography variant="subtitle1" color="inherit">
                  {title}
                </Typography>
              </Grid>
            </Grid>
          )}
        </Box>
      </Card>
    </>
  );
}

ColorBox.propTypes = {
  bgcolor: PropTypes.string,
  title: PropTypes.string,
  data: PropTypes.object.isRequired,
  dark: PropTypes.bool,
  main: PropTypes.bool,
};

// ===============================|| COMPONENT - COLOR ||=============================== //

const ComponentColor = () => {
  const dispatch = useDispatch();
  const [searchModel, setSearchModel] = useState({
    ProductName: "",
    CategoryId: "",
    Product_Tag: "",
  });
  const navigate = useNavigate();
  const product = useSelector((state) => state.product);
  const tag = useSelector((state) => state.tag);
  const infoProduct = useSelector((state) => state.infoProduct);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const category = useSelector((state) => state.category);
  const [productPicture, setProductPicture] = useState([]);
  const [productInPage, setProductInPage] = useState([]);
  const [name, setName] = useState("");
  const [file, setFile] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [quantitySold, setQuantitySold] = useState("");
  const [regularPrice, setRegularPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [timeBaoHanh, setTimeBaoHanh] = useState("");
  const [series, setSeries] = useState("");
  const [color, setColor] = useState("");
  const [cpu, setCPU] = useState("");
  const [card, setCard] = useState("");
  const [ram, setRam] = useState("");
  const [manhinh, setManHinh] = useState("");
  const [ocung, setOCung] = useState("");
  const [hedieuhanh, setHeDieuHanh] = useState("");
  const [khoiluong, setKhoiLuong] = useState("");
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const [listTag, setListTag] = useState([]);
  const [filebase64, setFileBase64] = useState([]);
  const handleCancel = () => setPreviewVisible(false);
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  useEffect(() => {
    const listScreen = JSON.parse(localStorage.getItem("screenrole"));
    let obj = listScreen.find((o) => o.screenSlug === "/product");
    console.log("obj", obj);
    if (!obj) {
      navigate("/404");
    }
  }, []);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);

      reader.onerror = (error) => reject(error);
    });

  useEffect(() => {
    setLoading(true);
    dispatch(getDataFilterProduct()).then((data) => {
      data.map((item, index) => (item.id = index + 1));
      setProductInPage(data);
      setLoading(false);
    });
    // dispatch(getProductRelated());
    dispatch(getAllCategory());
    dispatch(getTags());
    dispatch(getInfoProducts());
  }, [dispatch]);
  useEffect(() => {
    if (selectedRows[0]) {
      selectedRows[0] &&
        selectedRows[0].productPicture.map((item) =>
          Object.assign(item, { url: item.img, uid: item._id })
        );
    }
    setProductPicture(selectedRows[0] ? selectedRows[0].productPicture : []);
  }, [selectedRows]);

  var filterColor = infoProduct.infoProducts.filter((item) => {
    if (item.type === "mausac") return item;
  });
  var filterScreen = infoProduct.infoProducts.filter((item) => {
    if (item.type === "manhinh") return item;
  });
  var filterRam = infoProduct.infoProducts.filter((item) => {
    if (item.type === "ram") return item;
  });
  var filterCpu = infoProduct.infoProducts.filter((item) => {
    if (item.type === "cpu") return item;
  });

  const handleEdit = () => {};
  const handleUpdateProduct = async () => {
    if (name.trim() === "") {
      notification["warning"]({
        message: "Th??m m???i S???n ph???m",
        description: "Vui l??ng nh???p d??? li???u.",
      });
      return;
    }
    const list = [];
    const tempFileListImgUpload = [];
    const tempFileListImg = [];
    fileList.map((item) => {
      if (item.type === "image/png" || item.type === "image/jpeg") {
        tempFileListImgUpload.push(item);
      } else {
        tempFileListImg.push(item);
      }
    });

    const objFilterColor = filterColor?.find((data) => data._id === color);
    const objFilterRam = filterRam?.find((data) => data._id === ram);
    const objFilterCpu = filterCpu?.find((data) => data._id === cpu);
    const objFilterScreen = filterScreen?.find((data) => data._id === manhinh);

    if (tempFileListImgUpload && tempFileListImgUpload.length > 0) {
      for (let pic of tempFileListImgUpload) {
        const reader = new FileReader();
        if (pic) {
          const link = await getBase64(pic.originFileObj);
          list.push(link);
        }
      }
      try {
        await fetch(`${api}/product/uploadPicture`, {
          method: "POST",
          body: JSON.stringify({ data: list }),
          headers: { "Content-Type": "application/json" },
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error("Something went wrong");
          })
          .then((responseJson) => {
            const mergeImg = tempFileListImg.concat(responseJson.result);
            const data = {
              _id: selectedRows[0]._id,
              cpuId: objFilterCpu ? objFilterCpu._id : "",
              nameCpu: objFilterCpu ? objFilterCpu.name : "",
              typeCpu: objFilterCpu ? objFilterCpu.type : "",
              colorId: objFilterColor ? objFilterColor._id : "",
              nameColor: objFilterColor ? objFilterColor.name : "",
              typeColor: objFilterColor ? objFilterColor.type : "",
              ramId: objFilterRam ? objFilterRam._id : "",
              nameRam: objFilterRam ? objFilterRam.name : "",
              typeRam: objFilterRam ? objFilterRam.type : "",
              screenId: objFilterScreen ? objFilterScreen._id : "",
              nameScreen: objFilterScreen ? objFilterScreen.name : "",
              typeScreen: objFilterScreen ? objFilterScreen.type : "",
              name,
              listTag,
              quantity,
              regularPrice,
              salePrice,
              description,
              categoryId,
              productPicture: mergeImg,
              timeBaoHanh,
              series,
              card,
              ocung,
              hedieuhanh,
              khoiluong,
            };
            dispatch(editProduct(data)).then((data) => {
              dispatch(getDataFilterProduct()).then((data) => {
                data.map((item, index) => (item.id = index + 1));
                setProductInPage(data);
                setLoading(false);
              });
              if (data === "success") {
                handleClose();
                notification["success"]({
                  message: "Ch???nh s???a S???n ph???m",
                  description: "Ch???nh s???a S???n ph???m th??nh c??ng.",
                });
              } else {
                handleClose();
                notification["error"]({
                  message: "Ch???nh s???a S???n ph???m",
                  description: "Ch???nh s???a S???n ph???m th???t b???i.",
                });
              }
            });
          });
      } catch (err) {
        throw new Error("Something went wrong");
      }
    } else {
      const data = {
        _id: selectedRows[0]._id,
        cpuId: objFilterCpu ? objFilterCpu._id : "",
        nameCpu: objFilterCpu ? objFilterCpu.name : "",
        typeCpu: objFilterCpu ? objFilterCpu.type : "",
        colorId: objFilterColor ? objFilterColor._id : "",
        nameColor: objFilterColor ? objFilterColor.name : "",
        typeColor: objFilterColor ? objFilterColor.type : "",
        ramId: objFilterRam ? objFilterRam._id : "",
        nameRam: objFilterRam ? objFilterRam.name : "",
        typeRam: objFilterRam ? objFilterRam.type : "",
        screenId: objFilterScreen ? objFilterScreen._id : "",
        nameScreen: objFilterScreen ? objFilterScreen.name : "",
        typeScreen: objFilterScreen ? objFilterScreen.type : "",
        name,
        quantity,
        listTag,
        regularPrice,
        salePrice,
        description,
        categoryId,
        productPicture: tempFileListImg,
        timeBaoHanh,
        series,
        card,
        ocung,
        hedieuhanh,
        khoiluong,
      };
      dispatch(editProduct(data)).then((data) => {
        dispatch(getDataFilterProduct()).then((data) => {
          data.map((item, index) => (item.id = index + 1));
          setProductInPage(data);
          setLoading(false);
        });
        if (data === "success") {
          handleClose();
          notification["success"]({
            message: "Ch???nh s???a S???n ph???m",
            description: "Ch???nh s???a S???n ph???m th??nh c??ng.",
          });
        } else {
          handleClose();
          notification["error"]({
            message: "Ch???nh s???a S???n ph???m",
            description: "Ch???nh s???a S???n ph???m th???t b???i.",
          });
        }
      });
    }
  };
  const text = "B???n c?? ch???c ch???n mu???n xo???";
  const columns = [
    { field: "id", headerName: "STT", width: 130 },
    { field: "name", headerName: "T??n s???n ph???m", width: 300 },
    {
      field: "category",
      headerName: "H??ng",
      width: 130,
      renderCell: (params) => {
        return <div className="rowitem">{params.value.name}</div>;
      },
    },
    {
      field: "salePrice",
      headerName: "Gi?? ti???n",
      width: 130,
      renderCell: (params) => {
        return (
          <div className="rowitem">
            {formatThousand(params.row.salePrice)} VND
          </div>
        );
      },
    },
    {
      field: "quantity",
      headerName: "S??? l?????ng",
      type: "number",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="rowitem" style={{ textAlign: "center" }}>
            {formatThousand(params.row.quantity)}{" "}
          </div>
        );
      },
    },
    {
      field: "quantitySold",
      headerName: "S??? l?????ng ???? b??n",
      type: "number",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="rowitem" style={{ textAlign: "center" }}>
            {formatThousand(params.value)}
          </div>
        );
      },
    },
    {
      field: "color",
      headerName: "M??u",
      width: 180,
      renderCell: (params) => {
        return (
          <div className="rowitem">
            {params.row.descriptionTable[0].color[0].name}
          </div>
        );
      },
    },
  ];
  const gridStyle = {
    width: "50%",
    height: "80px",
  };
  // eslint-disable-next-line
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
  const handleView = () => {
    if (selectedRows.length === 0) {
      notification["warning"]({
        message: "Xem s???n ph???m",
        description: "Vui l??ng ch???n s???n ph???m b???n mu???n xem.",
      });
    } else if (selectedRows.length >= 2) {
      notification["warning"]({
        message: "Xem s???n ph???m",
        description: "Vui l??ng ch??? ch???n m???t s???n ph???m.",
      });
    } else {
      setType("view");
      handleOpen();
    }
  };
  const confirm = () => {
    if (selectedRows.length === 0) {
      notification["warning"]({
        message: "Xo?? s???n ph???m",
        description: "Vui l??ng ch???n s???n ph???m b???n mu???n xo??.",
      });
    } else {
      let listIdProduct = [];
      selectedRows.map((item) => {
        listIdProduct.push(item._id);
      });
      const payload = {
        productId: listIdProduct,
      };
      dispatch(deleteProductById(payload)).then((data) => {
        dispatch(getDataFilterProduct()).then((data) => {
          data.map((item, index) => (item.id = index + 1));
          setProductInPage(data);
          if (data === "success") {
            notification["success"]({
              message: "Xo?? S???n ph???m",
              description: "Xo?? S???n ph???m th??nh c??ng.",
            });
          } else {
            notification["error"]({
              message: "Xo?? S???n ph???m",
              description: "Xo?? S???n ph???m kh??ng th??nh c??ng.",
            });
          }
        });
      });
    }
  };
  const handleEditProduct = () => {
    if (selectedRows.length === 0) {
      notification["warning"]({
        message: "Ch???nh s???a s???n ph???m",
        description: "Vui l??ng ch???n s???n ph???m b???n mu???n ch???nh s???a.",
      });
    } else if (selectedRows.length >= 2) {
      notification["warning"]({
        message: "Xem s???n ph???m",
        description: "Vui l??ng ch??? ch???n m???t s???n ph???m.",
      });
    } else {
      // notification['success']({
      //     message: 'Ch???nh s???a s???n ph???m',
      //     description: 'Coming Soon'
      // });
      setType("edit");
      handleOpen();
    }
  };
  const createCategoryList = (categories, options = []) => {
    for (let category of categories) {
      options.push({ value: category._id, name: category.name });
      if (category.children.length > 0) {
        createCategoryList(category.children, options);
      }
    }
    return options;
  };
  const handleChangeCategory = (value) => {
    searchModel.CategoryId = value;
    setSearchModel(searchModel);
  };
  const handleChangeTag = (value) => {
    searchModel.Product_Tag = value;
    setSearchModel(searchModel);
  };
  const handleChangeProduct = (value) => {
    searchModel.ProductName = value;
    setSearchModel(searchModel);
  };

  // Filter in Product
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

  // Filter Name
  var filterArrayName = removeDuplicates(product.products, "name");

  const handleSearch = () => {
    setLoading(true);
    dispatch(getDataFilterProduct(searchModel)).then((data) => {
      data.map((item, index) => (item.id = index + 1));
      setProductInPage(data);
      setLoading(false);
    });
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
  const handleChangeTagProduct = (e) => {
    const {
      target: { value },
    } = e;
    setListTag(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  const modalProduct = (type) => {
    let title;
    let disable;
    if (type === "edit") {
      title = "Ch???nh s???a s???n ph???m";
      disable = false;
    }
    if (type === "view") {
      title = "Xem chi ti???t s???n ph???m";
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
                className="container_addProduct"
                style={{
                  display: "flex",
                  paddingTop: "0px",
                  color: "black",
                  fontSize: "17px",
                }}
              >
                <div
                  className="container_form_addProduct"
                  style={{
                    paddingBottom: "10px",
                    width: "100%",
                    paddingRight: "30px",
                  }}
                >
                  <TextField
                    required
                    style={{ width: "100%", marginBottom: "15px" }}
                    id="outlined-error"
                    label="T??n s???n ph???m"
                    defaultValue={name ? name : ""}
                    disabled={disable}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                  <TextField
                    required
                    id="outlined-number"
                    label="S??? l?????ng"
                    type="number"
                    style={{ width: "100%", marginBottom: "15px" }}
                    defaultValue={quantity ? quantity : ""}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={disable}
                    onChange={(e) => {
                      setQuantity(e.target.value);
                    }}
                  />
                  <TextField
                    required
                    id="outlined-number"
                    label="S??? l?????ng ???? b??n"
                    type="number"
                    style={{ width: "100%", marginBottom: "15px" }}
                    defaultValue={quantitySold ? quantitySold : 0}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={true}
                  />
                  <FormControl
                    fullWidth
                    style={{ width: "100%", marginBottom: "15px" }}
                  >
                    <InputLabel
                      htmlFor="outlined-adornment-amount"
                      disabled={disable}
                    >
                      Gi?? ti???n g???c
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-amount"
                      placeholder={formatThousand(
                        regularPrice ? regularPrice : ""
                      )}
                      defaultValue={regularPrice ? regularPrice : null}
                      startAdornment={
                        <InputAdornment position="start">VN??</InputAdornment>
                      }
                      label="Gi?? ti???n g???c"
                      disabled={disable}
                      onChange={(e) => {
                        setRegularPrice(e.target.value);
                      }}
                      // InputProps={{
                      //     inputComponent: NumberFormatCustom
                      // }}
                    />
                  </FormControl>
                  <FormControl
                    fullWidth
                    style={{ width: "100%", marginBottom: "15px" }}
                  >
                    <InputLabel
                      htmlFor="outlined-adornment-amount"
                      disabled={disable}
                    >
                      Gi?? ti???n gi???m gi??
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-amount"
                      defaultValue={salePrice ? salePrice : null}
                      disabled={disable}
                      startAdornment={
                        <InputAdornment position="start">VN??</InputAdornment>
                      }
                      label="Gi?? ti???n gi???m gi??"
                      onChange={(e) => {
                        setSalePrice(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormControl style={{ width: "100%", marginBottom: "15px" }}>
                    <InputLabel id="demo-multiple-checkbox-label">
                      Tag
                    </InputLabel>
                    <SelectMui
                      // disabled={disable}
                      defaultValue={listTag ? listTag : null}
                      disabled={disable}
                      label="Tag"
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      input={<OutlinedInput label="Tag" />}
                      // renderValue={(selected) => selected.join(', ')}
                      MenuProps={MenuProps}
                      onChange={handleChangeTagProduct}
                    >
                      {tag.tags.map((option) => (
                        <MenuItem value={option._id}>{option.tagName}</MenuItem>
                      ))}
                    </SelectMui>
                  </FormControl>
                  <FormControl
                    fullWidth
                    style={{ width: "100%", marginBottom: "15px" }}
                  >
                    <InputLabel id="demo-simple-select-label">
                      Th????ng hi???u
                    </InputLabel>
                    <SelectMui
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      defaultValue={categoryId ? categoryId : ""}
                      disabled={disable}
                      label="Th????ng hi???u"
                      onChange={(e) => setCategoryId(e.target.value)}
                    >
                      {category.categories.map((option) => (
                        <MenuItem value={option._id}>{option.name}</MenuItem>
                      ))}
                    </SelectMui>
                  </FormControl>
                  <Upload
                    listType="picture-card"
                    defaultFileList={fileList ? fileList : []}
                    onPreview={handlePreview}
                    beforeUpload={() => {
                      /* update state here */
                      return false;
                    }}
                    disabled={disable}
                    onChange={handleChange}
                  >
                    {uploadButton}
                  </Upload>
                </div>
              </div>
            </TabPane>
            <TabPane
              tab={<span>M?? t??? s???n ph???m</span>}
              style={{ paddingBottom: "20px" }}
              key="2"
            >
              <FormGroup>
                <CKEditor
                  config={{
                    enterMode: 2,
                    resize_minWidth: "100%",
                    resize_maxHeight: 600,
                    //filebrowserBrowseUrl: '/browser/browse.php',
                    //filebrowserUploadUrl: '/uploader/upload.php',
                    pasteFromWordRemoveStyles: false,
                    pasteFromWordNumberedHeadingToList: true,
                    pasteFromWordPromptCleanup: true,
                  }}
                  initData={description ? description : null}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  readOnly={disable}
                />
              </FormGroup>
            </TabPane>
            <TabPane tab={<span>M?? t??? chi ti???t</span>} key="3">
              <div
                className="table_des"
                style={{ width: "100%", color: "black", fontSize: "17px" }}
              >
                <div style={{ display: "block", width: "100%" }}>
                  <TextField
                    required
                    id="outlined-number"
                    label="Th???i gian b???o h??nh"
                    disabled={disable}
                    style={{
                      width: "45%",
                      marginBottom: "15px",
                      marginRight: "20px",
                    }}
                    value={timeBaoHanh ? timeBaoHanh : null}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => {
                      setTimeBaoHanh(e.target.value);
                    }}
                  />

                  <TextField
                    required
                    id="outlined-number"
                    label="Series"
                    style={{ width: "45%", marginBottom: "15px" }}
                    defaultValue={series ? series : null}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => {
                      setSeries(e.target.value);
                    }}
                    disabled={disable}
                  />
                </div>
                <div style={{ display: "block", width: "100%" }}>
                  <FormControl
                    style={{
                      width: "45%",
                      marginBottom: "15px",
                      marginRight: "20px",
                    }}
                  >
                    <InputLabel
                      id="demo-simple-select-label"
                      disabled={disable}
                    >
                      M??u s???c
                    </InputLabel>
                    <SelectMui
                      defaultValue={color ? color : ""}
                      label="M??u s???c"
                      labelId="demo-simple-select-label"
                      disabled={disable}
                      id="demo-simple-select"
                      onChange={(e) => setColor(e.target.value)}
                    >
                      {filterColor.map((option) => (
                        <MenuItem value={option._id}>{option.name}</MenuItem>
                      ))}
                    </SelectMui>
                  </FormControl>

                  <FormControl style={{ width: "45%", marginBottom: "15px" }}>
                    <InputLabel
                      id="demo-simple-select-label"
                      disabled={disable}
                    >
                      CPU
                    </InputLabel>
                    <SelectMui
                      defaultValue={cpu ? cpu : ""}
                      label="CPU"
                      labelId="demo-simple-select-label"
                      disabled={disable}
                      id="demo-simple-select"
                      onChange={(e) => setCPU(e.target.value)}
                    >
                      {filterCpu.map((option) => (
                        <MenuItem value={option._id}>{option.name}</MenuItem>
                      ))}
                    </SelectMui>
                  </FormControl>
                </div>
                <div style={{ display: "block", width: "100%" }}>
                  <TextField
                    required
                    id="outlined-number"
                    label="Card ????? h???a"
                    style={{
                      width: "45%",
                      marginBottom: "15px",
                      marginRight: "20px",
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    defaultValue={card ? card : null}
                    onChange={(e) => {
                      setCard(e.target.value);
                    }}
                    disabled={disable}
                  />

                  <FormControl style={{ width: "45%", marginBottom: "15px" }}>
                    <InputLabel
                      id="demo-simple-select-label"
                      disabled={disable}
                    >
                      Ram
                    </InputLabel>
                    <SelectMui
                      defaultValue={ram ? ram : ""}
                      disabled={disable}
                      label="Ram"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      onChange={(e) => setRam(e.target.value)}
                    >
                      {filterRam.map((option) => (
                        <MenuItem value={option._id}>{option.name}</MenuItem>
                      ))}
                    </SelectMui>
                  </FormControl>
                </div>
                <div style={{ display: "block", width: "100%" }}>
                  <FormControl
                    style={{
                      width: "45%",
                      marginBottom: "15px",
                      marginRight: "20px",
                    }}
                  >
                    <InputLabel
                      id="demo-simple-select-label"
                      disabled={disable}
                    >
                      M??n h??nh
                    </InputLabel>
                    <SelectMui
                      defaultValue={manhinh ? manhinh : ""}
                      disabled={disable}
                      label="M??n h??nh"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      onChange={(e) => setManHinh(e.target.value)}
                    >
                      {filterScreen.map((option) => (
                        <MenuItem value={option._id}>{option.name}</MenuItem>
                      ))}
                    </SelectMui>
                  </FormControl>

                  <TextField
                    required
                    id="outlined-number"
                    label="??? c???ng"
                    style={{ width: "45%", marginBottom: "15px" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    defaultValue={ocung ? ocung : null}
                    onChange={(e) => {
                      setOCung(e.target.value);
                    }}
                    disabled={disable}
                  />
                </div>
                <div style={{ display: "block", width: "100%" }}>
                  <TextField
                    required
                    id="outlined-number"
                    label="H??? ??i???u h??nh"
                    style={{
                      width: "45%",
                      marginBottom: "15px",
                      marginRight: "20px",
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={hedieuhanh ? hedieuhanh : null}
                    onChange={(e) => {
                      setHeDieuHanh(e.target.value);
                    }}
                    disabled={disable}
                  />

                  <TextField
                    required
                    id="outlined-number"
                    label="Kh???i l?????ng"
                    style={{ width: "45%", marginBottom: "15px" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={khoiluong ? khoiluong : null}
                    onChange={(e) => {
                      setKhoiLuong(e.target.value);
                    }}
                    disabled={disable}
                  />
                </div>
              </div>
            </TabPane>
          </Tabs>
          <CardActions sx={{ paddingLeft: "0" }}>
            <Button
              size="small"
              variant="outlined"
              color="success"
              onClick={handleUpdateProduct}
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
                    <Form.Item>M?? s???n ph???m</Form.Item>
                  </Col>
                  <Col span={16}>
                    <Form.Item>
                      <Select
                        mode="multiple"
                        optionFilterProp="data"
                        optionLabelProp="text"
                        onChange={handleChangeProduct}
                      >
                        {filterArrayName.map((item, index) => (
                          <Option
                            key={item._id}
                            data={item._id}
                            text={item._id}
                          >
                            <div className="global-search-item">
                              <span>{item._id}</span>
                              {/* <span style={{ float: 'right' }}> {index} </span> */}
                            </div>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </CardANTD.Grid>
              <CardANTD.Grid style={gridStyle}>
                <Row>
                  <Col span={8}>
                    <Form.Item>T??n s???n ph???m</Form.Item>
                  </Col>
                  <Col span={16}>
                    <Form.Item>
                      <Select
                        mode="multiple"
                        optionFilterProp="data"
                        optionLabelProp="text"
                        onChange={handleChangeProduct}
                      >
                        {filterArrayName.map((item, index) => (
                          <Option
                            key={item._id}
                            data={item.name}
                            text={item.name}
                          >
                            <div className="global-search-item">
                              <span>{item.name}</span>
                              {/* <span style={{ float: 'right' }}> {index} </span> */}
                            </div>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </CardANTD.Grid>
              <CardANTD.Grid style={gridStyle}>
                <Row>
                  <Col span={8}>
                    <Form.Item>T??n nh??n h??ng</Form.Item>
                  </Col>
                  <Col span={16}>
                    <Form.Item>
                      <Select
                        mode="multiple"
                        optionFilterProp="data"
                        optionLabelProp="text"
                        onChange={handleChangeCategory}
                      >
                        {category.categories.map((item, index) => (
                          <Option
                            key={item._id}
                            data={item._id}
                            text={item.name}
                          >
                            <div className="global-search-item">
                              <span>{item.name}</span>
                              {/* <span style={{ float: 'right' }}> {index} </span> */}
                            </div>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </CardANTD.Grid>
              <CardANTD.Grid style={gridStyle}>
                <Row>
                  <Col span={8}>
                    <Form.Item>Tag</Form.Item>
                  </Col>
                  <Col span={16}>
                    <Form.Item>
                      <Select
                        mode="multiple"
                        optionFilterProp="data"
                        optionLabelProp="text"
                        onChange={handleChangeTag}
                      >
                        {tag.tags.map((item, index) => (
                          <Option
                            key={item._id}
                            data={item._id}
                            text={item.tagName}
                          >
                            <div className="global-search-item">
                              <span>{item.tagName}</span>
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
          href="/createProduct"
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
          onClick={handleEditProduct}
        >
          Ch???nh s???a
        </Button>
      </Stack>
      {modalProduct(type)}
      {/* <Spin tip="Loading..." spinning={loading}> */}
      <Grid container spacing={3}>
        <div style={{ height: 600, width: "100%", marginLeft: "10px" }}>
          <DataGrid
            rows={productInPage.length !== 0 ? productInPage : []}
            columns={productInPage.length !== 0 ? columns : []}
            pageSize={8}
            rowsPerPageOptions={[8]}
            checkboxSelection
            getRowId={(row) => row._id}
            // onRowClick={(newSelection) => {
            //     setArraySelect((arraySelect) => [...arraySelect, newSelection]);
            // }}
            onSelectionModelChange={(ids) => {
              const selectedIDs = new Set(ids);
              const selectedRows = productInPage.filter((row) =>
                selectedIDs.has(row._id)
              );
              if (selectedRows.length === 1) {
                setName(selectedRows[0].name);
                setListTag(selectedRows[0].tag);
                setRegularPrice(selectedRows[0].regularPrice);
                setSalePrice(selectedRows[0].salePrice);
                setQuantity(selectedRows[0].quantity);
                setQuantitySold(selectedRows[0].quantitySold);
                setCategoryId(selectedRows[0].category._id);
                setFileList(selectedRows[0].productPicture);
                setDescription(selectedRows[0].description);
                setTimeBaoHanh(selectedRows[0].descriptionTable[0].baohanh);
                setSeries(selectedRows[0].descriptionTable[0].Series);
                setColor(selectedRows[0].descriptionTable[0].color[0].colorId);
                setCPU(selectedRows[0].descriptionTable[0].cpu[0].cpuId);
                setCard(selectedRows[0].descriptionTable[0].cardDohoa);
                setRam(selectedRows[0].descriptionTable[0].ram[0].ramId);
                setManHinh(
                  selectedRows[0].descriptionTable[0].manhinh[0].screenId
                );
                setOCung(selectedRows[0].descriptionTable[0].ocung);
                setHeDieuHanh(selectedRows[0].descriptionTable[0].hedieuhanh);
                setKhoiLuong(selectedRows[0].descriptionTable[0].khoiluong);
              }
              setSelectedRows(selectedRows);
            }}
            loading={loading}
          />
        </div>
      </Grid>
      {/* </Spin> */}
    </ComponentSkeleton>
  );
};

export default ComponentColor;
