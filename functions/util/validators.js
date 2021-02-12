const rr = require("rainbow-road");

// Empty string validation
const isEmpty = (str) => {
  if (str.trim() === "") return true;
  else return false;
};

// Email format validation
const isEmail = (email) => {
  const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

exports.validateSignupData = (data) => {
  let error;
  let valid;
  if (isEmpty(data.email)) {
    error = "Email must not be empty";
    valid = false;
    return { error, valid };
  } else if (!isEmail(data.email)) {
    error = "Invalid email address";
    valid = false;
    return { error, valid };
  } else if (isEmpty(data.password)) {
    error = "Password must not be empty";
    valid = false;
    return { error, valid };
  } else if (data.password !== data.confirmPassword) {
    error = "Passwords must match. Please try again.";
    valid = false;
    return { error, valid };
  } else if (isEmpty(data.username)) {
    error = "Username must not be empty";
    valid = false;
    return { error, valid };
  } else return { error: null, valid: true };
};

exports.validateLoginData = (data) => {
  let errors = {};
  if (isEmpty(data.email)) errors.email = "Must not be empty";
  if (isEmpty(data.password)) errors.password = "Must not be empty";
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.reduceMotto = (data) => {
  if (!data) {
    rr.err("Motto is empty!");
    return;
  }
  rr.info(`${data}`);
  return data.trim();
};

exports.reduceLocation = (data) => {
  if (!data) {
    rr.err("Location is empty!");
    return;
  }
  rr.info(`${data}`);
  return data.trim();
};

exports.reduceUserDetails = (data) => {
  let userDetails = {
    location: "",
    motto: "",
  };
  if (!isEmpty(data.location.trim())) userDetails.location = data.location;
  if (!isEmpty(data.motto.trim())) userDetails.motto = data.motto;
  console.log("details", userDetails);
  return userDetails;
};

exports.reduceUsername = (data) => {
  if (!data) {
    rr.err("Username is empty!");
    return;
  }
  rr.info(`${data}`);
  return data.trim();
};
