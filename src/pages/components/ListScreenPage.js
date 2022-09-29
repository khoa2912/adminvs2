// material-ui
import { styled } from '@mui/material/styles';

// project import
import ComponentSkeleton from './ComponentSkeleton';
import MainCard from 'components/MainCard';
import { Card as CardANTD, Spin } from 'antd';
import { Col, Collapse, Form, Row, Upload, Select } from '../../../node_modules/antd/lib/index';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
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
    OutlinedInput,
    MenuItem,
    CardActions
} from '../../../node_modules/@mui/material/index';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { notification, Space, Popconfirm } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from 'actions/auth';
import { getInitialData } from 'actions/initialData';
import { Tabs } from 'antd';
import { getDataFilterScreen } from 'actions/screen';
const { TabPane } = Tabs;
// styles
const IFrameWrapper = styled('iframe')(() => ({
    height: 'calc(100vh - 210px)',
    border: 'none'
}));
// ============================|| COMPONENT - ListScreenPage ||============================ //

const ListScreenPage = () => {
    const { Option } = Select;
    const dispatch = useDispatch();
    const [searchModel, setSearchModel] = useState({
        Screen_Code: '',
        Description: ''
    });
    const { TabPane } = Tabs;
    const [loading, setLoading] = useState(false);
    const [screenInPage, setScreenInPage] = useState([]);
    useEffect(() => {
        setLoading(true);
        dispatch(getDataFilterScreen()).then((data) => {
            data&&data.map((item, index) => (item.id = index + 1));
            setScreenInPage(data);
            setLoading(false);
        });
    }, [dispatch]);
    const handleEdit = () => {};
    const text = 'Bạn có chắc chắn muốn xoá?';
    const auth = useSelector((state) => state.auth);
    const screen = useSelector((state) => state.screen);
    const [type, setType] = useState('');
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [screenName, setScreenName] = useState('');
    const [screenCode, setScreenCode] = useState('');
    const [screenDescription, setScreenDescription] = useState('');
    const [status, setStatus] = useState('enable');
    const [open, setOpen] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);

    const columns = [
        { field: 'id', headerName: 'STT', width: 100 },
        { field: 'screenCode', headerName: 'Mã Screen', width: 200 },
        { field: 'screenName', headerName: 'Tên Screen', width: 300 },
        { field: 'screenDescription', headerName: 'Thông tin mô tả', width: 300 },
        { field: 'status', headerName: 'Trạng thái', width: 150 }
    ];
    const gridStyle = {
        width: '50%',
        height: '80px'
    };
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1000,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4
    };
    notification.config({
        placement: 'topRight',
        top: 80,
        duration: 3,
        rtl: false
    });
    const handleChangeScreenCode = (value) => {
        searchModel.Screen_Code = value;
        setSearchModel(searchModel);
    };
    const handleChangeDescription = (value) => {
        searchModel.Description = value;
        setSearchModel(searchModel);
    };

    // Filter in Screen
    function removeDuplicates(startArray, prop) {
        var newArray = [];
        var lookupObject  = {};
   
        for(var i in startArray) {
           lookupObject[startArray[i][prop]] = startArray[i];
        }
   
        for(i in lookupObject) {
            newArray.push(lookupObject[i]);
        }
        return newArray;
    }
   
    // Filter Screen name
    var filterArrayScreen = removeDuplicates(screenInPage, "screenName");
    console.log(filterArrayScreen);

    // Filter Description
    var filterArrayDescription = removeDuplicates(screenInPage, "screenDescription");
    console.log(filterArrayDescription);

    const handleView = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Xem Screen',
                description: 'Vui lòng chọn Screen bạn muốn xem.'
            });
        } else if (selectedRows.length >= 2) {
            notification['warning']({
                message: 'Xem Screen',
                description: 'Vui lòng chỉ chọn một Screen.'
            });
        } else {
            setType('view');
            handleOpen();
        }
    };

    const handleCreate = () => {
        setType('create');
        setScreenCode('');
        setScreenName('');
        setScreenDescription('');
        setStatus('');
        handleOpen();
    };
    const handleSearch = () => {
        setLoading(true);
        console.log(searchModel);
        dispatch(getDataFilterScreen(searchModel)).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setScreenInPage(data);
            setLoading(false);
        });
    };
    
    const handleEditScreen = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Chỉnh sửa screen',
                description: 'Vui lòng chọn screen bạn muốn chỉnh sửa.'
            });
        } else if (selectedRows.length >= 2) {
            notification['warning']({
                message: 'Chỉnh sửa screen',
                description: 'Vui lòng chỉ chọn một screen.'
            });
        } else {
            setType('edit');
            handleOpen();
        }
    };
    const confirm = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Xoá screen',
                description: 'Vui lòng chọn screen bạn muốn xoá.'
            });
        } else {
            notification['success']({
                message: 'Xoá screen',
                description: 'Xoá screen thành công.'
            });
        }
    };
    const modalScreen = (type) => {
        let title;
        let disable;
        if (type === 'edit') {
            title = 'Chỉnh sửa Screen';
            disable = false;
        } else if (type === 'view') {
            title = 'Xem chi tiết Screen';
            disable = true;
        }
        return (
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h3" component="h2">
                        {title}
                    </Typography>
                    <Tabs defaultActiveKey="1" style={{ color: 'black', fontSize: '19px' }}>
                        <TabPane tab={<span>Thông tin chung</span>} key="1">
                            <div
                                className="container_addProduct"
                                style={{
                                    display: 'flex',
                                    paddingTop: '0px',
                                    color: 'black',
                                    fontSize: '17px'
                                }}
                            >
                                <div
                                    className="container_form_addProduct"
                                    style={{
                                        paddingBottom: '20px',
                                        width: '100%',
                                        paddingRight: '30px'
                                    }}
                                >
                                    <TextField
                                        required
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        id="outlined-error"
                                        label="Mã Screen"
                                        defaultValue={type === 'create' ? '' : selectedRows[0] ? selectedRows[0].screenCode : screenCode}
                                        disabled="true"
                                    />
                                    <TextField
                                        required
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        id="outlined-error"
                                        label="Tên Screen"
                                        defaultValue={type === 'create' ? '' : selectedRows[0] ? selectedRows[0].screenName : screenName}
                                        disabled={disable}
                                    />
                                    <TextField
                                        required
                                        id="outlined-error"
                                        label="Thông tin mô tả"
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        defaultValue={type === 'create' ? '' : selectedRows[0] ? selectedRows[0].screenDescription : screenDescription}
                                        disabled={disable}
                                    />
                                    <FormControl fullWidth>
                                        <InputLabel variant="standard" htmlFor="uncontrolled-native">
                                            Trạng thái Screen
                                        </InputLabel>
                                        <NativeSelect
                                            disabled={disable}
                                            defaultValue={type === 'create' ? '' : selectedRows[0] ? selectedRows[0].status : status}
                                            inputProps={{
                                            name: 'status',
                                            id: 'uncontrolled-native',
                                            }}
                                        >
                                            <option value={'enable'}>Sử dụng</option>
                                            <option value={'disable'}>Ngừng sử dụng</option>
                                        </NativeSelect>
                                    </FormControl>
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                    <CardActions sx={{}}>
                        <Button size="small" variant="outlined" color="success" onClick={handleEdit}>
                            Lưu
                        </Button>
                        <Button size="small" variant="outlined" onClick={handleClose}>
                            Đóng
                        </Button>
                    </CardActions>
                </Box>
            </Modal>
        );
    };
    return (
        <ComponentSkeleton>
            <Form style={{ marginBottom: '10px' }}>
                <Collapse defaultActiveKey={['1']} expandIconPosition={'right'} className="mps-search-header-collapse">
                    <Collapse.Panel header={<span className="mps-search-header-panel-title"> Thông tin tìm kiếm</span>} key="1">
                        <CardANTD style={{ border: 'none' }}>
                            <CardANTD.Grid style={gridStyle}>
                                <Row>
                                    <Col span={8}>
                                        <Form.Item>Tên Screen</Form.Item>
                                    </Col>
                                    <Col span={16}>
                                        <Form.Item>
                                            <Select
                                                mode="multiple"
                                                optionFilterProp="data"
                                                optionLabelProp="text"
                                                onChange={handleChangeScreenCode}
                                            >
                                                {filterArrayScreen.map((item) => (
                                                    <Option key={item.screenCode} data={item.screenCode} text={item.screenCode}>
                                                        <div className="global-search-item">
                                                            <span>{item.screenCode}</span>
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
                                        <Form.Item>Mô tả</Form.Item>
                                    </Col>
                                    <Col span={16}>
                                        <Form.Item>
                                            <Select
                                                mode="multiple"
                                                optionFilterProp="data"
                                                optionLabelProp="text"
                                                onChange={handleChangeDescription}
                                            >
                                                {filterArrayDescription.map((item) => (
                                                    <Option key={item.screenCode} data={item.screenCode} text={item.screenCode}>
                                                        <div className="global-search-item">
                                                            <span>{item.screenCode}</span>
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
                <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2} sx={{ marginBottom: '20px' }}>
                    <Button variant="outlined" onClick={handleCreate} color="success" startIcon={<AddIcon />} style={{ cursor: 'pointer' }}>
                        Thêm mới
                    </Button>
                    <Button variant="outlined" style={{ cursor: 'pointer' }} onClick={handleView}>
                        Xem
                    </Button>
                    <Button variant="outlined" style={{ cursor: 'pointer' }} onClick={handleEditScreen}>
                        Chỉnh sửa
                    </Button>
                    <Popconfirm placement="right" title={text} onConfirm={confirm} okText="Đồng ý" cancelText="Không">
                        <Button
                            variant="outlined"
                            color="error"
                            style={{ cursor: 'pointer' }}
                            startIcon={<DeleteIcon />}
                            // onClick={handleDeleteProduct}
                        >
                            Xoá
                        </Button>
                    </Popconfirm>
                    <Button variant="outlined" onClick={handleSearch} startIcon={<SearchIcon />} style={{ cursor: 'pointer' }}>
                        Tìm kiếm
                    </Button>
                </Stack>
                {modalScreen(type)}
                <Grid container spacing={3}>
                    <div style={{ height: 600, width: '100%', marginLeft: '10px' }}>
                        <DataGrid
                            rows={screenInPage.length !== 0 ? screenInPage : []}
                            columns={screenInPage.length !== 0 ? columns : []}
                            pageSize={8}
                            rowsPerPageOptions={[8]}
                            checkboxSelection
                            getRowId={(row) => row._id}
                            onSelectionModelChange={(ids) => {
                                const selectedIDs = new Set(ids);
                                const selectedRows = screenInPage.filter((row) => selectedIDs.has(row._id));
                                console.log(selectedRows);
                                // if (selectedRows.length === 1) {
                                //     setScreenCode(selectedRows[0].screenCode);
                                //     setScreenName(selectedRows[0].screenName);
                                //     setScreenDescription(selectedRows[0].screenDescription);
                                //     setStatus(selectedRows[0].status);
                                    
                                // }
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
