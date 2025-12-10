import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Grid,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    TablePagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    Chip,
    Avatar,
    Tooltip,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    InputAdornment,
    Divider,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from "@mui/material";
import {
    Edit,
    Delete,
    Search,
    PersonAdd,
    FilterList,
    Phone,
    Email,
    Work,
    CalendarToday,
    AttachMoney,
    People,
    Visibility,
} from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import CommonTextField from "../../components/common/CommonTextField";

// API Configuration
const API_BASE_URL = "http://localhost:5000/api/employees";
const API_ENDPOINTS = {
    ALL_EMPLOYEES: `${API_BASE_URL}/all-employees-data`,
    ACTIVE_EMPLOYEES: `${API_BASE_URL}/active-employees`,
    INACTIVE_EMPLOYEES: `${API_BASE_URL}/inactive-employees`,
    CREATE_EMPLOYEE: `${API_BASE_URL}/create-employee`,
    GET_EMPLOYEE: (id) => `${API_BASE_URL}/get-employee-data/${id}`,
    UPDATE_EMPLOYEE: (id) => `${API_BASE_URL}/update-employee/${id}`,
    DELETE_EMPLOYEE: (id) => `${API_BASE_URL}/delete-employee/${id}`,
};

export default function EmployeeManagement() {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(2); // CHANGED: Set to 2 rows per page
    const [searchTerm, setSearchTerm] = useState("");
    const [openAddEditModal, setOpenAddEditModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [formData, setFormData] = useState({
        user_name: "",
        mobile_number: "",
        email: "",
        department: "",
        role: "",
        salary: "",
        password_hash: "",
        date_of_joining: "",
        status: "active",
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all"); 

    // Fetch initial data
    useEffect(() => {
        fetchEmployees();
    }, []);

    // Filter employees based on search term and status
    useEffect(() => {
        let filtered = employees;

        // Apply status filter
        if (filterStatus === "active") {
            filtered = filtered.filter(emp =>
                emp.status?.toLowerCase() === "active" ||
                emp.status?.toLowerCase() === "active"
            );
        } else if (filterStatus === "inactive") {
            filtered = filtered.filter(emp =>
                emp.status?.toLowerCase() === "inactive" ||
                emp.status?.toLowerCase() === "inactive"
            );
        }

        // Apply search term filter
        if (searchTerm) {
            filtered = filtered.filter(
                (emp) =>
                    emp.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    emp.mobile_number?.includes(searchTerm) ||
                    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    emp.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    emp.role?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredEmployees(filtered);
        setPage(0);
    }, [searchTerm, employees, filterStatus]);

    // API Functions
    const fetchEmployees = async (status = "all") => {
        try {
            setLoading(true);
            let endpoint;

            if (status === "active") {
                endpoint = API_ENDPOINTS.ACTIVE_EMPLOYEES;
            } else if (status === "inactive") {
                endpoint = API_ENDPOINTS.INACTIVE_EMPLOYEES;
            } else {
                endpoint = API_ENDPOINTS.ALL_EMPLOYEES;
            }

            const response = await axios.get(endpoint);

            // Handle different API response structures
            const data = response.data.data || response.data;

            const employeesData = Array.isArray(data) ? data.map((emp) => ({
                ...emp,
                id: emp.employee_id || emp.id,
                date_of_joining: emp.date_of_joining?.split("T")[0],
            })) : [];

            setEmployees(employeesData);
            setFilteredEmployees(employeesData);
        } catch (err) {
            toast.error("Failed to load employees");
            console.error("Error fetching employees:", err);
        } finally {
            setLoading(false);
        }
    };

    const createEmployee = async (employeeData) => {
        try {
            const response = await axios.post(API_ENDPOINTS.CREATE_EMPLOYEE, {
                user_name: employeeData.user_name,
                mobile_number: employeeData.mobile_number,
                email: employeeData.email,
                department: employeeData.department,
                role: employeeData.role,
                salary: parseFloat(employeeData.salary),
                password_hash: employeeData.password_hash,
                date_of_joining: employeeData.date_of_joining,
                status: employeeData.status || "active",
            });
            return response.data;
        } catch (err) {
            console.error("Error creating employee:", err.response?.data);
            throw err;
        }
    };

    const updateEmployee = async (id, employeeData) => {
        try {
            const response = await axios.put(API_ENDPOINTS.UPDATE_EMPLOYEE(id), {
                user_name: employeeData.user_name,
                mobile_number: employeeData.mobile_number,
                email: employeeData.email,
                department: employeeData.department,
                role: employeeData.role,
                salary: parseFloat(employeeData.salary),
                date_of_joining: employeeData.date_of_joining,
                status: employeeData.status || "active",
            });
            return response.data;
        } catch (err) {
            console.error("Error updating employee:", err.response?.data);
            throw err;
        }
    };

    const deleteEmployee = async (id) => {
        try {
            const response = await axios.delete(API_ENDPOINTS.DELETE_EMPLOYEE(id));
            return response.data;
        } catch (err) {
            console.error("Error deleting employee:", err.response?.data);
            throw err;
        }
    };

    // Validation
    const validateForm = () => {
        const errors = {};
        if (!formData.user_name.trim()) errors.user_name = "Name is required";
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
            errors.email = "Valid email is required";
        if (!formData.mobile_number.match(/^\d{10}$/))
            errors.mobile_number = "10-digit phone number is required";
        if (!formData.department.trim()) errors.department = "Department is required";
        if (!formData.role.trim()) errors.role = "Role is required";
        if (!formData.salary || formData.salary <= 0)
            errors.salary = "Valid salary is required";
        if (!formData.date_of_joining)
            errors.date_of_joining = "Joining date is required";
        if (!selectedEmployee && !formData.password_hash.trim())
            errors.password_hash = "Password is required for new employees"
        return errors;
    };

    // Handlers
    const handleOpenAddEditModal = (employee = null) => {
        if (employee) {
            setSelectedEmployee(employee);
            setFormData({
                user_name: employee.user_name || "",
                mobile_number: employee.mobile_number || "",
                email: employee.email || "",
                department: employee.department || "",
                role: employee.role || "",
                salary: employee.salary || "",
                date_of_joining: employee.date_of_joining || "",
                status: employee.status || "active",
            });
        } else {
            setSelectedEmployee(null);
            setFormData({
                user_name: "",
                mobile_number: "",
                email: "",
                department: "",
                role: "",
                salary: "",
                password_hash: "",
                date_of_joining: "",
                status: "active",
            });
        }
        setFormErrors({});
        setOpenAddEditModal(true);
    };

    const handleOpenViewModal = (employee) => {
        setSelectedEmployee(employee);
        setOpenViewModal(true);
    };

    const handleCloseAddEditModal = () => {
        setOpenAddEditModal(false);
        setSelectedEmployee(null);
        setFormErrors({});
    };

    const handleCloseViewModal = () => {
        setOpenViewModal(false);
        setSelectedEmployee(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (formErrors[name]) {
            setFormErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            toast.error("Please fix the errors in the form");
            return;
        }

        setIsSubmitting(true);
        try {
            if (selectedEmployee) {
                await updateEmployee(selectedEmployee.id, formData);
                toast.success("Employee updated successfully!");
            } else {
                await createEmployee(formData);
                toast.success("Employee added successfully!");
            }
            fetchEmployees(filterStatus); // Refresh with current filter
            handleCloseAddEditModal();
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Operation failed. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenDeleteDialog = (employee) => {
        setSelectedEmployee(employee);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSelectedEmployee(null);
    };

    const handleDelete = async () => {
        try {
            await deleteEmployee(selectedEmployee.id);
            toast.success("Employee deleted successfully!");
            fetchEmployees(filterStatus);
            handleCloseDeleteDialog();
        } catch (err) {
            toast.error("Failed to delete employee");
        }
    };

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleStatusFilterChange = (event) => {
        const status = event.target.value;
        setFilterStatus(status);
        fetchEmployees(status);
    };

    // Status color mapping
    const getStatusColor = (status) => {
        const statusLower = status?.toLowerCase();
        if (statusLower === "active") return "success";
        if (statusLower === "inactive") return "error";
        if (statusLower === "on leave") return "warning";
        return "default";
    };

    // Stats calculation
    const stats = {
        total: employees.length,
        active: employees.filter((e) =>
            e.status?.toLowerCase() === "active" ||
            e.status?.toLowerCase() === "active"
        ).length,
        inactive: employees.filter((e) =>
            e.status?.toLowerCase() === "inactive" ||
            e.status?.toLowerCase() === "inactive"
        ).length,
    };

    if (loading && employees.length === 0) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, sm: 4 }, minHeight: "100vh" }}>
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />

            {/* Header Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 8, md: 8 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary", mb: 1 }}>
                        Employee Management
                    </Typography>
                    <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
                        Manage your team members, roles, and departments in one place
                    </Typography>

                    {/* Stats Cards */}
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                            <Card sx={{
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                color: "white",
                                borderRadius: 2,
                            }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Total</Typography>
                                    <Typography variant="h3" sx={{ fontWeight: 800 }}>{stats.total}</Typography>
                                    <People sx={{ position: "absolute", right: 16, bottom: 16, opacity: 0.3, fontSize: 48 }} />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Card sx={{
                                background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                                color: "white",
                                borderRadius: 2,
                            }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Active</Typography>
                                    <Typography variant="h3" sx={{ fontWeight: 800 }}>{stats.active}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Card sx={{
                                background: "linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)",
                                color: "white",
                                borderRadius: 2,
                            }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Inactive</Typography>
                                    <Typography variant="h3" sx={{ fontWeight: 800 }}>{stats.inactive}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} md={4} sx={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end" }}>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            startIcon={<PersonAdd />}
                            onClick={() => handleOpenAddEditModal()}
                            sx={{
                                borderRadius: 2,
                                px: 3,
                                background: "linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)",
                                "&:hover": {
                                    background: "linear-gradient(135deg, #303f9f 0%, #1976d2 100%)",
                                },
                            }}
                        >
                            Add Employee
                        </Button>
                    </Stack>
                </Grid>
            </Grid>

            {/* Search and Filter Section */}
            <Paper
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2,
                    background: "linear-gradient(to right, #f8f9ff, #ffffff)",
                    border: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <CommonTextField
                            fullWidth
                            placeholder="Search employees by name, email, phone, or department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search sx={{ color: "text.secondary" }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    background: "white",
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Status Filter</InputLabel>
                            <Select
                                value={filterStatus}
                                onChange={handleStatusFilterChange}
                                label="Status Filter"
                                sx={{
                                    borderRadius: 2,
                                    background: "white",
                                }}
                            >
                                <MenuItem value="all">All Employees</MenuItem>
                                <MenuItem value="active">Active Only</MenuItem>
                                <MenuItem value="inactive">Inactive Only</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Button
                            variant="outlined"
                            startIcon={<FilterList />}
                            onClick={() => {
                                setSearchTerm("");
                                setFilterStatus("all");
                                fetchEmployees();
                            }}
                            sx={{ borderRadius: 2, px: 3, width: "100%" }}
                        >
                            Clear Filters
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Employee Table */}
            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ background: "linear-gradient(90deg, #f8f9ff 0%, #f0f4ff 100%)" }}>
                            <TableCell sx={{ fontWeight: 700, py: 2 }}>Employee</TableCell>
                            <TableCell sx={{ fontWeight: 700, py: 2 }}>Contact</TableCell>
                            <TableCell sx={{ fontWeight: 700, py: 2 }}>Department</TableCell>
                            <TableCell sx={{ fontWeight: 700, py: 2 }}>Role</TableCell>
                            <TableCell sx={{ fontWeight: 700, py: 2 }}>Salary</TableCell>
                            <TableCell sx={{ fontWeight: 700, py: 2 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 700, py: 2, textAlign: "center" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredEmployees.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
                                    <Typography color="text.secondary">No employees found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredEmployees
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((emp) => (
                                    <TableRow
                                        key={emp.id}
                                        hover
                                        sx={{
                                            "&:hover": {
                                                background: "linear-gradient(90deg, rgba(63, 81, 181, 0.04) 0%, rgba(33, 150, 243, 0.04) 100%)",
                                            },
                                        }}
                                    >
                                        <TableCell sx={{ py: 2 }}>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar
                                                    sx={{
                                                        bgcolor: "primary.main",
                                                        width: 40,
                                                        height: 40,
                                                        fontSize: "1rem",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {emp.user_name?.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography fontWeight={600}>{emp.user_name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        ID: {emp.id}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell sx={{ py: 2 }}>
                                            <Stack spacing={0.5}>
                                                <Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                    <Phone sx={{ fontSize: 14 }} />
                                                    {emp.mobile_number}
                                                </Typography>
                                                <Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                    <Email sx={{ fontSize: 14 }} />
                                                    {emp.email}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell sx={{ py: 2 }}>
                                            <Chip
                                                label={emp.department}
                                                size="small"
                                                icon={<People sx={{ fontSize: 14 }} />}
                                                sx={{ borderRadius: 1 }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ py: 2 }}>
                                            <Chip
                                                label={emp.role}
                                                size="small"
                                                icon={<Work sx={{ fontSize: 14 }} />}
                                                color="primary"
                                                variant="outlined"
                                                sx={{ borderRadius: 1 }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ py: 2 }}>
                                            <Typography fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                <AttachMoney sx={{ fontSize: 16 }} />
                                                {parseInt(emp.salary).toLocaleString()}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Monthly
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ py: 2 }}>
                                            <Chip
                                                label={emp.status || "Active"}
                                                color={getStatusColor(emp.status)}
                                                size="small"
                                                sx={{ borderRadius: 1, fontWeight: 600 }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ py: 2, textAlign: "center" }}>
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <Tooltip title="View">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleOpenViewModal(emp)}
                                                        sx={{
                                                            background: "linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(66, 165, 245, 0.1) 100%)",
                                                            "&:hover": { background: "rgba(33, 150, 243, 0.2)" },
                                                        }}
                                                    >
                                                        <Visibility sx={{ fontSize: 18, color: "#2196f3" }} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleOpenAddEditModal(emp)}
                                                        sx={{
                                                            background: "linear-gradient(135deg, rgba(63, 81, 181, 0.1) 0%, rgba(33, 150, 243, 0.1) 100%)",
                                                            "&:hover": { background: "rgba(63, 81, 181, 0.2)" },
                                                        }}
                                                    >
                                                        <Edit sx={{ fontSize: 18, color: "#3f51b5" }} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleOpenDeleteDialog(emp)}
                                                        sx={{
                                                            background: "linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(229, 57, 53, 0.1) 100%)",
                                                            "&:hover": { background: "rgba(244, 67, 54, 0.2)" },
                                                        }}
                                                    >
                                                        <Delete sx={{ fontSize: 18, color: "#f44336" }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[2, 5, 10, 25, 50]} // CHANGED: Added 2 as first option
                    component="div"
                    count={filteredEmployees.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                        borderTop: "1px solid",
                        borderColor: "divider",
                    }}
                />
            </TableContainer>

            {/* Add/Edit Employee Modal - Scrollable */}
            <Dialog
                open={openAddEditModal}
                onClose={handleCloseAddEditModal}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        overflow: "hidden",
                        background: "linear-gradient(to bottom right, #ffffff, #f8faff)",
                        maxHeight: "90vh",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        background: "linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)",
                        color: "white",
                        py: 3,
                        position: "sticky",
                        top: 0,
                        zIndex: 1,
                    }}
                >
                    <Box sx={{ position: "relative", zIndex: 1 }}>
                        <Typography variant="h5" fontWeight={700}>
                            {selectedEmployee ? "Edit Employee" : "Add New Employee"}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                            {selectedEmployee ? "Update employee information" : "Fill in the employee details"}
                        </Typography>
                    </Box>
                </DialogTitle>

                <form onSubmit={handleSubmit}>
                    <DialogContent dividers sx={{ p: 0, maxHeight: "60vh", overflowY: "auto" }}>
                        <Box sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                {/* Personal Information */}
                                <Grid item xs={12}>
                                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
                                        Personal Information
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <CommonTextField
                                                fullWidth
                                                name="user_name"
                                                label="Full Name"
                                                value={formData.user_name}
                                                onChange={handleFormChange}
                                                error={!!formErrors.user_name}
                                                helperText={formErrors.user_name}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <CommonTextField
                                                fullWidth
                                                name="email"
                                                label="Email Address"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleFormChange}
                                                error={!!formErrors.email}
                                                helperText={formErrors.email}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <CommonTextField
                                                fullWidth
                                                name="mobile_number"
                                                label="Phone Number"
                                                type="tel"
                                                value={formData.mobile_number}
                                                onChange={handleFormChange}
                                                error={!!formErrors.mobile_number}
                                                helperText={formErrors.mobile_number}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <CommonTextField
                                                fullWidth
                                                name="password_hash"
                                                label={selectedEmployee ? "New Password (leave empty to keep current)" : "Password"}
                                                type="password"
                                                value={formData.password_hash}
                                                onChange={handleFormChange}
                                                error={!!formErrors.password_hash}
                                                helperText={formErrors.password_hash}
                                                required={!selectedEmployee}
                                                autoComplete="new-password"
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 2, width: "100%" }} />

                                {/* Professional Information */}
                                <Grid item xs={12}>
                                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
                                        Professional Information
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <CommonTextField
                                                fullWidth
                                                name="department"
                                                label="Department"
                                                value={formData.department}
                                                onChange={handleFormChange}
                                                error={!!formErrors.department}
                                                helperText={formErrors.department}
                                                required
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <CommonTextField
                                                fullWidth
                                                name="role"
                                                label="Role"
                                                value={formData.role}
                                                onChange={handleFormChange}
                                                error={!!formErrors.role}
                                                helperText={formErrors.role}
                                                required
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <CommonTextField
                                                fullWidth
                                                name="salary"
                                                label="Salary"
                                                type="number"
                                                value={formData.salary}
                                                onChange={handleFormChange}
                                                error={!!formErrors.salary}
                                                helperText={formErrors.salary}
                                                required
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <AttachMoney />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <CommonTextField
                                                fullWidth
                                                name="date_of_joining"
                                                label="Date of Joining"
                                                type="date"
                                                value={formData.date_of_joining}
                                                onChange={handleFormChange}
                                                error={!!formErrors.date_of_joining}
                                                helperText={formErrors.date_of_joining}
                                                required
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <CommonTextField
                                                select
                                                fullWidth
                                                name="status"
                                                label="Status"
                                                value={formData.status}
                                                onChange={handleFormChange}
                                                SelectProps={{
                                                    native: true,
                                                }}
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                                <option value="on leave">On Leave</option>
                                            </CommonTextField>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{ p: 3, pt: 2, position: "sticky", bottom: 0, background: "white", borderTop: "1px solid #e0e0e0" }}>
                        <Button
                            onClick={handleCloseAddEditModal}
                            sx={{
                                px: 4,
                                borderRadius: 2,
                                border: "2px solid",
                                borderColor: "divider",
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                            sx={{
                                px: 4,
                                borderRadius: 2,
                                background: "linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)",
                                "&:hover": {
                                    background: "linear-gradient(135deg, #303f9f 0%, #1976d2 100%)",
                                },
                            }}
                        >
                            {isSubmitting ? (
                                <CircularProgress size={24} sx={{ color: "white" }} />
                            ) : selectedEmployee ? (
                                "Update Employee"
                            ) : (
                                "Add Employee"
                            )}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* View Employee Modal - Scrollable */}
            <Dialog
                open={openViewModal}
                onClose={handleCloseViewModal}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        overflow: "hidden",
                        background: "linear-gradient(to bottom right, #ffffff, #f8faff)",
                        maxHeight: "90vh",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                        color: "white",
                        py: 3,
                        position: "sticky",
                        top: 0,
                        zIndex: 1,
                    }}
                >
                    <Box sx={{ position: "relative", zIndex: 1 }}>
                        <Typography variant="h5" fontWeight={700}>
                            Employee Details
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                            View complete employee information
                        </Typography>
                    </Box>
                </DialogTitle>

                <DialogContent dividers sx={{ p: 0, maxHeight: "60vh", overflowY: "auto" }}>
                    {selectedEmployee && (
                        <Box sx={{ p: 3 }}>
                            <Box sx={{ textAlign: "center", mb: 3 }}>
                                <Avatar
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        mx: "auto",
                                        mb: 2,
                                        bgcolor: "primary.main",
                                        fontSize: "2.5rem",
                                        fontWeight: 600,
                                    }}
                                >
                                    {selectedEmployee.user_name?.charAt(0)}
                                </Avatar>
                                <Typography variant="h5" fontWeight={700} gutterBottom>
                                    {selectedEmployee.user_name}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" gutterBottom>
                                    {selectedEmployee.role} • {selectedEmployee.department}
                                </Typography>
                                <Chip
                                    label={selectedEmployee.status || "Active"}
                                    color={getStatusColor(selectedEmployee.status)}
                                    sx={{ borderRadius: 1, fontWeight: 600, px: 2 }}
                                />
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
                                        Contact Information
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ p: 2, bgcolor: "#f8f9fa", borderRadius: 2 }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Email
                                                </Typography>
                                                <Typography fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                                                    <Email sx={{ fontSize: 16 }} />
                                                    {selectedEmployee.email}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ p: 2, bgcolor: "#f8f9fa", borderRadius: 2 }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Phone
                                                </Typography>
                                                <Typography fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                                                    <Phone sx={{ fontSize: 16 }} />
                                                    {selectedEmployee.mobile_number}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
                                        Professional Details
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ p: 2, bgcolor: "#f8f9fa", borderRadius: 2 }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Department
                                                </Typography>
                                                <Typography fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                                                    <People sx={{ fontSize: 16 }} />
                                                    {selectedEmployee.department}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ p: 2, bgcolor: "#f8f9fa", borderRadius: 2 }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Role
                                                </Typography>
                                                <Typography fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                                                    <Work sx={{ fontSize: 16 }} />
                                                    {selectedEmployee.role}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ p: 2, bgcolor: "#f8f9fa", borderRadius: 2 }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Salary
                                                </Typography>
                                                <Typography fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                                                    <AttachMoney sx={{ fontSize: 16 }} />
                                                    {parseInt(selectedEmployee.salary).toLocaleString()}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ p: 2, bgcolor: "#f8f9fa", borderRadius: 2 }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Date of Joining
                                                </Typography>
                                                <Typography fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                                                    <CalendarToday sx={{ fontSize: 16 }} />
                                                    {selectedEmployee.date_of_joining}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 3, pt: 2, borderTop: "1px solid #e0e0e0" }}>
                    <Button
                        onClick={handleCloseViewModal}
                        sx={{
                            px: 4,
                            borderRadius: 2,
                            border: "2px solid",
                            borderColor: "divider",
                        }}
                    >
                        Close
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            handleCloseViewModal();
                            handleOpenAddEditModal(selectedEmployee);
                        }}
                        sx={{
                            px: 4,
                            borderRadius: 2,
                            background: "linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)",
                        }}
                    >
                        Edit Employee
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        overflow: "hidden",
                        border: "2px solid",
                        borderColor: "error.light",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        background: "linear-gradient(135deg, #ff6b6b 0%, #f44336 100%)",
                        color: "white",
                        py: 3,
                        textAlign: "center",
                    }}
                >
                    <Delete sx={{ fontSize: 48, mb: 2 }} />
                    <Typography variant="h5" fontWeight={700}>
                        Confirm Deletion
                    </Typography>
                </DialogTitle>

                <DialogContent sx={{ p: 4, textAlign: "center" }}>
                    {selectedEmployee && (
                        <Box sx={{ mb: 3 }}>
                            <Avatar
                                sx={{
                                    width: 80,
                                    height: 80,
                                    mx: "auto",
                                    mb: 2,
                                    bgcolor: "error.main",
                                    fontSize: "2rem",
                                    fontWeight: 600,
                                }}
                            >
                                {selectedEmployee.user_name?.charAt(0)}
                            </Avatar>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                {selectedEmployee.user_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {selectedEmployee.role} • {selectedEmployee.department}
                            </Typography>
                        </Box>
                    )}

                    <Alert severity="error" variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
                        <Typography fontWeight={600}>
                            This action cannot be undone. All data associated with this employee will be permanently deleted.
                        </Typography>
                    </Alert>

                    <Typography variant="body2" color="text.secondary">
                        Are you sure you want to proceed?
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ p: 3, pt: 0, justifyContent: "center" }}>
                    <Button
                        onClick={handleCloseDeleteDialog}
                        variant="outlined"
                        sx={{
                            px: 4,
                            borderRadius: 2,
                            border: "2px solid",
                            borderColor: "divider",
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        color="error"
                        sx={{
                            px: 4,
                            borderRadius: 2,
                            background: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
                            "&:hover": {
                                background: "linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)",
                            },
                        }}
                    >
                        Delete Employee
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}