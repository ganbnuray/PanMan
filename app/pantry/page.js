"use client";
import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Box,
  Typography,
  Button,
  Drawer,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  FormLabel,
  Stack,
} from "@mui/material";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { signOut } from "firebase/auth";
import { Istok_Web, Galada } from "next/font/google";
const istok_web = Istok_Web({ weight: ["400", "700"], subsets: ["latin"] });
const galada = Galada({ weight: "400", subsets: ["latin"] });
const theme = createTheme({
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          p: 50,
          m: 0,
          fontWeight: "bold",
          width: "100vw",
        },
      },
    },
    MuiTypography: {
      fontFamily: `${istok_web.style.fontFamily}, sans-serif`,
      lineHeight: "2em",
      fontSize: { xs: "15px", lg: "20px" },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: "none",
          color: "#000",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "capitalize",
          fontFamily: `${istok_web.style.fontFamily}, sans-serif`,
          borderRadius: "15px",
          boxShadow: "none",
          ":hover": {
            backgroundColor: "#fff",
            boxShadow: "none",
          },
        },
      },
    },
  },
});
export default function Pantry() {
  const uid = sessionStorage.getItem("uid");

  const [itemName, setItemName] = useState("");
  const [amount, setQuantity] = useState("");
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchAndLogInventory = async () => {
    const querySnapshot = await getDocs(collection(db, `users/${uid}/pantry`));
    const inventoryList = [];
    querySnapshot.forEach((doc) => {
      inventoryList.push({ id: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };
  useEffect(() => {
    fetchAndLogInventory();
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    addItem2(itemName, Number(amount));
    setItemName("");
    setQuantity("");
  };

  const handleRecipes = (e) => {
    router.push("../recipes/");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      //console.log("User signed out successfully");
      router.push("./");
      // Redirect to login page or perform other actions
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  const addItem = async (item) => {
    const docRef = doc(collection(db, `users/${uid}/pantry`), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    }
    await fetchAndLogInventory();
  };

  const addItem2 = async (item, amount) => {
    const docRef = doc(collection(db, `users/${uid}/pantry`), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity: existingQuantity } = docSnap.data();
      await setDoc(docRef, { quantity: existingQuantity + amount });
    } else {
      await setDoc(docRef, { quantity: amount });
    }
    await fetchAndLogInventory();
  };

  const decreaseItem = async (item) => {
    const docRef = doc(collection(db, `users/${uid}/pantry`), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await fetchAndLogInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(db, `users/${uid}/pantry`), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await deleteDoc(docRef);
    }
    await fetchAndLogInventory();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const router = useRouter();
  const drawer = (
    <Box sx={{ minWidth: "300px", backgroundColor: "#F2F8F6", height: "100%" }}>
      <Box
        width="80%"
        margin="auto"
        pt={5}
        display="flex"
        sx={{ flexDirection: "column" }}
      >
        <Box
          flex="1"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Box
            component={"img"}
            sx={{
              width: "65px",
              height: "60px",
            }}
            src="logo.svg"
          />
          <Typography
            sx={{
              fontFamily: `${galada.style.fontFamily}, sans-serif`,
              fontSize: "45px",
              pl: "15px",
            }}
          >
            PanMan
          </Typography>
        </Box>
        <Box mt={4}>
          <Typography sx={{ fontWeight: "700", color: "#676767" }}>
            Pages
          </Typography>
          <Button
            display="flex"
            alignitems="baseline"
            variant="outlined"
            sx={{
              backgroundColor: "#CCE5B3",
              border: "2px solid #000",
              ":hover": {
                backgroundColor: "#B6CC9F",
                border: "2px solid #000",
              },
              mt: "15px",
              borderRadius: "15px",
            }}
          >
            <Box
              component={"img"}
              src="edit.svg"
              sx={{ width: "28px" }}
              mr={1}
            />
            <Typography sx={{ color: "#000", fontWeight: "bold" }}>
              Inventory
            </Typography>
          </Button>
          <Button
            display="flex"
            alignitems="baseline"
            variant="outlined"
            bgcolor="transparent"
            border="none"
            sx={{
              minWidth: "100px",
              border: "none",
              "&:hover": {
                backgroundColor: "transparent",
                border: "none",
              },
              mt: "15px",
              borderRadius: "15px",
            }}
            onClick={handleRecipes}
          >
            <Box
              component={"img"}
              src="paper.svg"
              sx={{ width: "28px" }}
              mr={1}
            />
            <Typography sx={{ color: "#000", fontWeight: "bold" }}>
              AI Recipe
            </Typography>
          </Button>
        </Box>
        <Box>
          <Button
            display="flex"
            alignitems="baseline"
            variant="outlined"
            bgcolor="transparent"
            border="none"
            sx={{
              minWidth: "100px",
              border: "none",
              "&:hover": {
                backgroundColor: "transparent",
                border: "none",
              },
              mt: "calc(100vh - 400px)",
              px: "0",
              borderRadius: "15px",
            }}
            onClick={handleLogout}
          >
            <Box
              component={"img"}
              src="logout.svg"
              sx={{ width: "28px" }}
              mr={1}
            />
            <Typography sx={{ color: "#000", fontWeight: "bold" }}>
              Log out
            </Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  );
  const filteredInventory = inventory.filter(
    (item) =>
      item.id &&
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      item.quantity !== null
  );

  return (
    <ThemeProvider theme={theme}>
      <>
        <link rel="icon" href="logo.svg" />
      </>
      <Container
        disableGutters
        maxWidth={"false"}
        //sx={{ backgroundColor: "red" }}
      >
        <Box
          display="flex"
          flex="1"
          sx={{ flexDirection: { sm: "row", xs: "column" } }}
          justifyContent={"flex-start"}
          minHeight="100vh"
        >
          {isMobile ? (
            <>
              <Box width="90%" margin="auto" mt={2}>
                <IconButton
                  aria-label="open drawer"
                  display="flex"
                  onClick={handleDrawerToggle}
                  sx={{
                    display: { sm: "none" },
                    justifyContent: "flex-start",
                    padding: "0px",
                    flexDirection: "row",
                  }}
                  marginleft="0"
                  marginright="0"
                >
                  <MenuIcon sx={{ fontSize: "50px", color: "#000" }} />
                </IconButton>
              </Box>

              <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                  display: { sm: "block", md: "none" },
                  "& .MuiDrawer-paper": { boxSizing: "border-box", flex: 1 },
                }}
              >
                {drawer}
              </Drawer>
            </>
          ) : (
            <Box id="sidebar" sx={{ flex: 1, flexShrink: 0, flexGrow: 1 }}>
              {drawer}
            </Box>
          )}

          <Box flex="4">
            <Box
              width="90%"
              margin="auto"
              pt="60px"
              height="100vh"
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <TextField
                variant="outlined"
                placeholder="Search..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: "100%",
                  borderRadius: "20px",
                  backgroundColor: "#F2F8F6",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px", // Add border radius to the root element
                    "& fieldset": {
                      border: "none", // Change outline color to black
                      borderRadius: "20px", // Ensure the border radius is applied to the fieldset
                    },
                    "&:hover fieldset": {
                      borderColor: "black", // Change outline color to black on hover
                    },
                    "&.Mui-focused fieldset": {
                      border: "1px solid #D9D9D9", // Change outline color to black when focused
                    },
                    "& input": {
                      color: "#000", // Change text color to white for better contrast
                    },
                    "& .MuiInputAdornment-root": {
                      color: "#000", // Change icon color to white for better contrast
                    },
                  },
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Adjust width as needed
              />

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  display: "flex",
                  flexdirection: "row",
                  justifyContent: "center",
                  alignItems: "end",
                  flexWrap: "no-wrap",
                  gap: { lg: 5, md: 3, xs: 2 },
                  width: { lg: "70%", md: "80", xs: "100%" },
                  margin: "auto",
                  backgroundColor: "white",
                  marginTop: 5,
                  marginBottom: 8,
                }}
              >
                <FormControl>
                  <FormLabel>
                    <Typography sx={{ fontSize: "16px", color: "#1E1E1E" }}>
                      Item name
                    </Typography>
                  </FormLabel>
                  <TextField
                    variant="outlined"
                    value={itemName}
                    type="text"
                    onChange={(e) => setItemName(e.target.value)}
                    required
                    sx={{
                      borderRadius: "8px",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px", // Add border radius to the root element
                        "& fieldset": {
                          border: "1px solid #D9D9D9", // Change outline color to black
                          borderRadius: "8px", // Ensure the border radius is applied to the fieldset
                        },
                        "&:hover fieldset": {
                          borderColor: "black", // Change outline color to black on hover
                        },
                        "&.Mui-focused fieldset": {
                          border: "1px solid #000", // Change outline color to black when focused
                        },
                        "& input": {
                          color: "#000", // Change text color to white for better contrast
                          padding: "10px",
                        },
                        "& .MuiInputAdornment-root": {
                          color: "#000", // Change icon color to white for better contrast
                        },
                      },
                    }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>
                    <Typography sx={{ fontSize: "16px", color: "#1E1E1E" }}>
                      Quantity
                    </Typography>
                  </FormLabel>
                  <TextField
                    variant="outlined"
                    type="number"
                    value={amount}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    sx={{
                      borderRadius: "8px",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px", // Add border radius to the root element
                        "& fieldset": {
                          border: "1px solid #D9D9D9", // Change outline color to black
                          borderRadius: "8px", // Ensure the border radius is applied to the fieldset
                        },
                        "&:hover fieldset": {
                          borderColor: "black", // Change outline color to black on hover
                        },
                        "&.Mui-focused fieldset": {
                          border: "1px solid #000", // Change outline color to black when focused
                        },
                        "& input": {
                          color: "#000", // Change text color to white for better contrast
                          padding: "10px",
                        },
                        "& .MuiInputAdornment-root": {
                          color: "#000", // Change icon color to white for better contrast
                        },
                      },
                    }}
                  />
                </FormControl>
                <Box>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                      borderRadius: "8px",
                      height: "43px",
                      minWidth: "100px",
                      width: "140px",
                      backgroundColor: "#2C2C2C",
                      color: "#FFF",
                      border: "none",
                      "&:hover": {
                        backgroundColor: "#000",
                      },
                    }}
                    onClick={() => {
                      addItem2(itemName.toLowerCase(), Number(amount));
                      setItemName("");
                    }}
                  >
                    Add item
                  </Button>
                </Box>
              </Box>

              <Box
                sx={{
                  flexGrow: 1,
                  borderRadius: "20px",
                  border: "3px solid #F2F8F6",
                  marginBottom: 5,
                  overflow: "auto",
                }}
              >
                <Box sx={{ width: "96%", paddingY: 3 }} margin="auto">
                  <Stack spacing={2}>
                    {filteredInventory.map(({ id, quantity }) => (
                      <Box
                        key={id}
                        sx={{
                          width: "100%",
                          px: 3,
                          height: "70px",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: "#F2F8F6",
                          borderRadius: "20px",
                          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Adjust the box shadow as needed
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography>{id}</Typography>
                        </Box>
                        <Box
                          sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                          }}
                        >
                          <Typography>{quantity}</Typography>
                        </Box>
                        <Box
                          sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            gap: 2,
                          }}
                        >
                          <Button
                            variant="contained"
                            sx={{
                              minWidth: "min-content",
                              paddingX: 2,
                              borderRadius: "8px",
                              backgroundColor: "#2C2C2C",
                              color: "#FFF",
                              "&:hover": {
                                backgroundColor: "#000",
                              },
                            }}
                            onClick={() => addItem(id)}
                          >
                            +
                          </Button>
                          <Button
                            variant="contained"
                            sx={{
                              minWidth: "min-content",
                              paddingX: 2,
                              borderRadius: "8px",
                              backgroundColor: "#2C2C2C",
                              color: "#FFF",
                              "&:hover": {
                                backgroundColor: "#000",
                              },
                            }}
                            onClick={() => decreaseItem(id)}
                          >
                            -
                          </Button>
                          <Button
                            variant="contained"
                            sx={{
                              borderRadius: "8px",
                              backgroundColor: "red",
                              color: "#FFF",
                              "&:hover": {
                                backgroundColor: "darkred",
                              },
                            }}
                            onClick={() => removeItem(id)}
                          >
                            Delete
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
