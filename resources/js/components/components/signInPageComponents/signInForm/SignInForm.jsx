// src/components/signInPageComponents/signInForm/SignInForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../../contexts/UserAuthContext";
import "./signInForm.css";

// MUI Imports
import Visibility from "@mui/icons-material/Visibility"; // Eye icon
import VisibilityOff from "@mui/icons-material/VisibilityOff"; // Eye-off icon
import Alert from "@mui/material/Alert"; // For error messages
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton"; // Add IconButton for eye

export default function SignInForm() {
  const navigate = useNavigate();
  const { signIn } = useUserAuth();

  // Form state management
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Error state
  const [error, setError] = useState("");
  // Loading state for button
  const [isLoading, setIsLoading] = useState(false);

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false); // State for toggling

  // Toggle password visibility
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { success, error, user } = await signIn(
        formData.email,
        formData.password
      );

      if (success) {
        console.log("Successfully signed in:", user);
        // Redirect after successful login
        navigate("/trips");
      } else {
        setError(error || "Sign in failed. Please check your credentials.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Sign in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signInFormComponent">
      <Grid container spacing={0}>
        <Grid size={{ xs: 12, md: 7 }}>
          <div className="signInFormWrapper">
            <div className="signInFormWrapperImgContainer">
              <img
                src="/assets/signInAssets/fagnoon.svg"
                alt=""
                className="signInFormWrapperImg"
              />
            </div>
            <h3 className="signInFormWrapperTitle">Sign In</h3>
            <p className="signInFormWrapperSubTitle">
              Welcome back! Please enter your details
            </p>

            {error && <Alert severity="error">{error}</Alert>}

            <form onSubmit={handleSubmit} className="signInForm">
              <div className="signInFormChip">
                <p className="signInFormChipInpLabel">Email</p>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="signInFormChipInp"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="signInFormChip passwordContainer">
                <p className="signInFormChipInpLabel">Password</p>
                <div className="passwordInputWrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="signInFormChipInp"
                    required
                  />

                  <IconButton
                    onClick={handleTogglePassword}
                    className="passwordToggleIcon"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </div>
              </div>

              <div className="signInFormCheckContainerAndForget">
                <FormGroup className="signInFormCheckContainer">
                  <FormControlLabel
                    className="signInFormCheck"
                    control={
                      <Checkbox
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        name="rememberMe"
                        id="rememberMe"
                      />
                    }
                    label="Remember Me"
                  />
                </FormGroup>

                <div className="signInFormForgetBtnContainer">
                  <Button variant="text" className="signInFormForgetBtn">
                    Forget Password?
                  </Button>
                </div>
              </div>

              <div className="signInFormBtnContainer">
                <Button
                  type="submit"
                  variant="contained"
                  className="signInFormBtn"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </div>
            </form>
          </div>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <div className="signInFormComponentImgContainer">
            <img
              src="/assets/signInAssets/signInForm.svg"
              alt=""
              className="signInFormComponentImg"
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
