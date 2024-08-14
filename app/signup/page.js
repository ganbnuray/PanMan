"use client";
import {
  Container,
  Box,
  Typography,
  Link,
  Button,
  Drawer,
  IconButton,
  GlobalStyles,
  Divider,
  TextField,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Istok_Web, Galada } from "next/font/google";
import { useRouter } from "next/navigation";
//import validator from "validator";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
const istok_web = Istok_Web({ weight: ["400", "700"], subsets: ["latin"] });
const galada = Galada({ weight: "400", subsets: ["latin"] });
import { db, provider, auth } from "../firebase";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  linkWithPopup,
} from "firebase/auth";
import { doc, setDoc, collection, getDoc } from "firebase/firestore";

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
      fontSize: "20px",
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

export default function Signup() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [uid, setUid] = useState(null);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userUid = user.uid;
      setUid(userUid);
      sessionStorage.setItem("uid", userUid);
      //console.log(`User is logged in, and uid: ${userUid}`);
    } else {
      setUid(null);
      sessionStorage.removeItem("uid");
      //console.log(`User signed out, and the uid currently: null`);
    }
  });

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };
  const router = useRouter();
  const handleSignUp = () => {
    router.push("./signup");
  };

  const handleLogin = () => {
    router.push("./login");
  };
  const handleHome = () => {
    router.push("./");
  };
  const validator = require("validator");
  const passwordValidator = require("password-validator");

  // Create a schema
  const schema = new passwordValidator();
  schema
    .is()
    .min(8) // Minimum length 8
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .digits() // Must have digits
    .has()
    .symbols() // Must have special characters
    .has()
    .not()
    .spaces(); // Should not have spaces
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  useEffect(() => {
    console.log(error);
  }, [error]);

  const handleEmailSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // Create a document for the user
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
      });
      // Create a collection for the user
      const pantryCollectionRef = collection(db, `users/${user.uid}/pantry`);
      await setDoc(doc(pantryCollectionRef, "empty"), { quantity: null });
      await linkWithPopup(user, provider);
      //alert("Account created successfully!");
      router.push("./pantry");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 1. Check if the user exists in the database
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        // User already exists, do nothing
        //console.log("User already exists, no changes made.");
      } else {
        // User is new, create a document and a pantry collection
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          createdAt: new Date(),
        });
        // Create a collection for the user
        const pantryCollectionRef = collection(db, `users/${user.uid}/pantry`);
        await setDoc(doc(pantryCollectionRef, "empty"), { quantity: null });

        // You can add a document to the collection here if needed
        // await setDoc(doc(pantryCollectionRef, "firstItem"), { /* ... */ });

        //console.log("New user created and pantry collection added.");
      }

      //alert("Signed in with Google!");
      router.push("./pantry");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSubmit = () => {
    if (email === "") {
      setError("Enter your email please");
    } else if (!validator.isEmail(email)) {
      setError("Please enter a valid email address");
    } else if (password.length == 0 || confirmPassword.length == 0) {
      setError("Please enter your password");
    } else if (password != confirmPassword) {
      setError("Passwords don't match");
    } else if (!schema.validate(password)) {
      setError(
        "Password is not valid. Your password should have at least 8 characters: at least 1 uppercase, at least 1 lowercase, at least 1 special character and should contain no spaces"
      );
    } else {
      setError("");
      handleEmailSignUp();
      router.push("/pantry");
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <>
        <link rel="icon" href="logo.svg" />
        <GlobalStyles styles={{ html: { scrollBehavior: "smooth" } }} />
      </>
      <Container disableGutters maxWidth={"false"}>
        <Box
          width={"90%"}
          margin={"auto"}
          backgroundColor="#fff"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: "20px",
          }}
        >
          <Box flex="1" sx={{ display: "flex", alignItems: "center" }}>
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
                fontFamily: `${galada.style.fontFamily}`,
                fontSize: "45px",
                pl: "15px",
              }}
            >
              PanMan
            </Typography>
          </Box>
          <Box
            flex="1"
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <Link href="./">
              <Typography
                fontSize="25px"
                color="#676767"
                sx={{ ":hover": { color: "#1c1b1d" } }}
              >
                Home
              </Typography>
            </Link>
            <Link href="./#about">
              <Typography
                fontSize="25px"
                color="#676767"
                sx={{ ":hover": { color: "#1c1b1d" } }}
              >
                About
              </Typography>
            </Link>
            <Link href="./#contacts">
              <Typography
                fontSize="25px"
                color="#676767"
                sx={{ ":hover": { color: "#1c1b1d" } }}
              >
                Contacts
              </Typography>
            </Link>
          </Box>
          <Box
            flex="1"
            gap={3}
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              justifyContent: "end",
            }}
          >
            <Button
              variant="contained"
              sx={{
                border: "2px solid #73B915",
                color: "#1c1b1d",
                backgroundColor: "#fff",
                fontWeight: "700",
                ":hover": {
                  backgroundColor: "#fbfcfa",
                },
                fontSize: "25px",
              }}
              onClick={handleSignUp}
            >
              Sign up
            </Button>
            <Button
              variant="contained"
              sx={{
                border: "none",
                backgroundColor: "#73B915",
                color: "#fff",
                fontWeight: "700",
                ":hover": {
                  backgroundColor: "#5b940f",
                },
                fontSize: "25px",
              }}
              onClick={handleLogin}
            >
              Login
            </Button>
          </Box>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: "block", md: "none" } }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon sx={{ fontSize: "50px" }} />
          </IconButton>
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
          >
            <Box
              sx={{ width: 250 }}
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
              paddingLeft="30px"
              paddingTop="30px"
            >
              <Link href="./#home">
                <Typography
                  fontSize="25px"
                  color="#676767"
                  sx={{ ":hover": { color: "#1c1b1d" }, padding: "10px" }}
                >
                  Home
                </Typography>
              </Link>
              <Link href="./#about">
                <Typography
                  fontSize="25px"
                  color="#676767"
                  sx={{ ":hover": { color: "#1c1b1d" }, padding: "10px" }}
                >
                  About
                </Typography>
              </Link>
              <Link href="./#contacts">
                <Typography
                  fontSize="25px"
                  color="#676767"
                  sx={{ ":hover": { color: "#1c1b1d" }, padding: "10px" }}
                >
                  Contacts
                </Typography>
              </Link>
              <Button
                variant="contained"
                sx={{
                  border: "2px solid #73B915",
                  color: "#1c1b1d",
                  backgroundColor: "#fff",
                  fontWeight: "700",
                  ":hover": {
                    backgroundColor: "#fbfcfa",
                  },
                  fontSize: "25px",
                  marginTop: "10px",
                  width: { xs: "200px" },
                }}
                onClick={handleSignUp}
              >
                Sign up
              </Button>
              <Button
                variant="contained"
                sx={{
                  border: "none",
                  backgroundColor: "#73B915",
                  color: "#fff",
                  fontWeight: "700",
                  ":hover": {
                    backgroundColor: "#5b940f",
                  },
                  fontSize: "25px",
                  marginTop: "15px",
                  width: { xs: "200px" },
                }}
                onClick={handleLogin}
              >
                Login
              </Button>
            </Box>
          </Drawer>
        </Box>

        <Box
          width={"90%"}
          margin={"auto"}
          mb={6}
          //backgroundColor="red"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            mt: "20px",
          }}
        >
          <Box
            flex={1}
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Button
              variant="text"
              sx={{
                ":hover": {
                  backgroundColor: "transparent",
                },
              }}
              onClick={handleHome}
            >
              <ArrowCircleLeftOutlinedIcon
                sx={{
                  color: "#676767",
                  fontSize: "48px",
                  ":hover": {
                    backgroundColor: "transparent",
                    color: "#4a4a4a",
                  },
                }}
              />
            </Button>
          </Box>

          <Box flex={1.3} width="100%">
            <Box
              sx={{ backgroundColor: "#F2F8F6", borderRadius: "15px" }}
              pt={3}
              my={3}
            >
              <Box width="85%" margin="auto">
                <Typography sx={{ fontWeight: "700", fontSize: "30px" }}>
                  Sign up
                </Typography>

                <Typography sx={{ color: "#676767", fontSize: "20px" }}>
                  Please provide your details.
                </Typography>

                <Button
                  style={{ width: "100%" }}
                  variant="outlined"
                  sx={{
                    border: "2px solid #73B915",
                    ":hover": {
                      backgroundColor: "transparent",
                      border: "2px solid #73B915",
                    },
                    mt: "15px",
                    borderRadius: "15px",
                  }}
                  onClick={handleGoogleSignIn}
                >
                  <Box
                    component={"img"}
                    src="google.svg"
                    sx={{ width: "26px" }}
                    mr={2}
                  />
                  <Typography sx={{ color: "#000" }}>
                    Sign up with Google
                  </Typography>
                </Button>

                <Divider aria-hidden="true" style={{ margin: "20px 0" }}>
                  <Typography sx={{ color: "rgba(103,103,103,0.5)" }}>
                    OR
                  </Typography>
                </Divider>

                <Box>
                  <Typography variant="h6" sx={{ color: "#676767" }}>
                    Email address
                  </Typography>
                  <TextField
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    style={{ width: "100%" }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          border: "none",
                        },
                      },
                      border: "2px solid #73B915",
                      mb: "15px",
                      borderRadius: "15px",
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ color: "#676767" }}>
                    Password
                  </Typography>
                  <TextField
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    style={{ width: "100%" }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          border: "none",
                        },
                      },
                      border: "2px solid #73B915",
                      mb: "15px",
                      borderRadius: "15px",
                    }}
                    mb={2}
                  />
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ color: "#676767" }}>
                    Confirm Password
                  </Typography>
                  <TextField
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    style={{ width: "100%" }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          border: "none",
                        },
                      },
                      border: "2px solid #73B915",
                      mb: "15px",
                      borderRadius: "15px",
                    }}
                    mb={2}
                  />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      display: error === "" ? "none" : "block",
                      color: error === "" ? "#349e16" : "#db141e",
                    }}
                  >
                    {error}
                  </Typography>
                </Box>

                <Button
                  style={{ width: "100%" }}
                  variant="contained"
                  sx={{
                    backgroundColor: "#73B915",
                    ":hover": {
                      backgroundColor: "#5b940f",
                    },
                    mt: "15px",
                    borderRadius: "15px",
                  }}
                  onClick={handleSubmit}
                >
                  <Typography sx={{ color: "#fff", fontWeight: "700" }}>
                    Continue
                  </Typography>
                </Button>

                <Typography
                  textAlign={"center"}
                  sx={{ color: "#676767" }}
                  pb={2}
                  mt={2}
                >
                  Already have an acount?{" "}
                  <Link
                    href="./login"
                    sx={{ fontWeight: "bold", textDecoration: "underline" }}
                  >
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box flex={1} sx={{ display: { xs: "none", md: "block" } }}></Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
