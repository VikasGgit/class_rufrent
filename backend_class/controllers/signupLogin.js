
// const admin = require("firebase-admin");
// const db = require("../config/db");
// const dotenv = require("dotenv");
// const DatabaseService = require("../utils/service");

// dotenv.config();

// admin.initializeApp({
//   credential: admin.credential.cert(require('../config/firebase_admin.json')),
// });


// class AuthController {
//   constructor() {
//     this.dbService = new DatabaseService();
//   }

//   async signup(req, res) {
//     const { uid, email, displayName, mobile_no, role_id, token } = req.body;

//     // Check for required fields
//     if (!uid || !email || !role_id || !token) {
//       return res.status(400).json({ message: "Required fields are missing." });
//     }

//     try {
//       // Check if the user already exists
//       const existingUser = await this.dbService.getRecordsByFields(
//         "dy_user",
//         "*",
//         `uid = ${db.escape(uid)}`
//       );

//       if (existingUser.length > 0) {
//         return res.status(409).json({ message: "User already exists. Please login." });
//       }

//       // Fetch the role name based on role_id from the roles table
//       const roleResults = await this.dbService.getRecordsByFields(
//         "st_role",
//         "role",
//         `id = ${db.escape(role_id)}`
//       );
//       const roleName = roleResults.length > 0 ? roleResults[0].role : null;

//       if (!roleName) {
//         return res.status(400).json({ message: "Invalid role_id. Role not found." });
//       }

//       // Prepare and add the new user to the database
//       const fieldNames = "uid, user_name, email_id, mobile_no, role_id";
//       const fieldValues = `${db.escape(uid)}, ${db.escape(displayName || null)}, ${db.escape(email)}, ${db.escape(mobile_no || null)}, ${db.escape(role_id)}`;
//       const result = await this.dbService.addNewRecord("dy_user", fieldNames, fieldValues);

//       // Set custom claims for the user in Firebase
//       await admin.auth().setCustomUserClaims(uid, { role: roleName });

//       // Generate a Firebase token
//       const firebaseToken = token;

//       // Respond with success and necessary details
//       res.status(201).json({
//         message: "User registered successfully.",
//         token: firebaseToken,
//         uid,
//         role: roleName,
//         email:email,
//       });
//     } catch (err) {
//       console.error("Error during signup:", err.message);
//       res.status(500).json({ message: "Internal server error." });
//     }
//   }

// //   async g_login(req, res) {
// //   const { uid, email, displayName, mobile_no, token, role_id } = req.body;

// //   // Check if required fields are provided
// //   if (!uid || !email || !token) {
// //     return res.status(400).json({ message: "Required fields are missing." });
// //   }

// //   try {
// //     // Check if the user exists in the database
// //     const existingUser = await this.dbService.getRecordsByFields(
// //       "dy_user",
// //       "*",
// //       `uid = ${db.escape(uid)}`
// //     );

// //     const roleResults = await this.dbService.getRecordsByFields(
// //       "st_role",
// //       "role",
// //       `id = ${db.escape(assignedRoleId)}`
// //     );
// //     const roleName = roleResults.length > 0 ? roleResults[0].role : null;

// //     if (!roleName) {
// //       return res.status(400).json({ message: "Invalid role_id. Role not found." });
// //     }

// //     if (existingUser.length > 0) {
// //       // User already exists, generate and return token
// //       return res.status(200).json({
// //         message: "Login successful.",
// //         token,
// //         uid,
// //         role: existingUser[0].role_id, // Assuming `role_id` is stored in the user record
// //         email: existingUser[0].email_id,
// //       });
// //     }

// //     // If user does not exist, create a new user
// //     const assignedRoleId = role_id || 2; // Assign role_id from input or default to 2

// //     // Fetch the role name based on the assigned role_id from the roles table
// //     const roleResults = await this.dbService.getRecordsByFields(
// //       "st_role",
// //       "role",
// //       `id = ${db.escape(assignedRoleId)}`
// //     );
// //     const roleName = roleResults.length > 0 ? roleResults[0].role : null;

// //     if (!roleName) {
// //       return res.status(400).json({ message: "Invalid role_id. Role not found." });
// //     }

// //     // Prepare and add the new user to the database
// //     const fieldNames = "uid, user_name, email_id, mobile_no, role_id";
// //     const fieldValues = `${db.escape(uid)}, ${db.escape(displayName || null)}, ${db.escape(email)}, ${db.escape(mobile_no)}, ${db.escape(assignedRoleId)}`;
// //     const result = await this.dbService.addNewRecord("dy_user", fieldNames, fieldValues);

// //     // Set custom claims for the user in Firebase
// //     await admin.auth().setCustomUserClaims(uid, { role: roleName });

// //     // Respond with success and return the generated token
// //     res.status(201).json({
// //       message: "User registered and logged in successfully.",
// //       token,
// //       uid,
// //       role: roleName,
// //       email,
// //     });
// //   } catch (err) {
// //     console.error("Error during Google login:", err.message);
// //     res.status(500).json({ message: "Internal server error." });
// //   }
// // }

// async g_login(req, res) {
//   const { uid, email, displayName, mobile_no, token, role_id } = req.body;

//   // Check if required fields are provided
//   if (!uid || !email || !token) {
//     return res.status(400).json({ message: "Required fields are missing." });
//   }

//   try {
//     // Check if the user exists in the database
//     const existingUser = await this.dbService.getRecordsByFields(
//       "dy_user",
//       "*",
//       `uid = ${db.escape(uid)}`
//     );

//     if (existingUser.length > 0) {
//       // User already exists, fetch the role name
//       const roleResults = await this.dbService.getRecordsByFields(
//         "st_role",
//         "role",
//         `id = ${db.escape(existingUser[0].role_id)}`
//       );
//       const roleName = roleResults.length > 0 ? roleResults[0].role : null;

//       return res.status(200).json({
//         message: "Login successful.",
//         token,
//         uid,
//         role: roleName, // Sending the role name instead of role_id
//         email: existingUser[0].email_id,
//       });
//     }

//     // If user does not exist, create a new user
//     const assignedRoleId = role_id || 2; // Assign role_id from input or default to 2

//     // Fetch the role name based on the assigned role_id from the roles table
//     const roleResults = await this.dbService.getRecordsByFields(
//       "st_role",
//       "role",
//       `id = ${db.escape(assignedRoleId)}`
//     );
//     const roleName = roleResults.length > 0 ? roleResults[0].role : null;

//     if (!roleName) {
//       return res.status(400).json({ message: "Invalid role_id. Role not found." });
//     }

//     // Prepare and add the new user to the database
//     const fieldNames = "uid, user_name, email_id, mobile_no, role_id";
//     const fieldValues = `${db.escape(uid)}, ${db.escape(displayName || null)}, ${db.escape(email)}, ${db.escape(mobile_no)}, ${db.escape(assignedRoleId)}`;
//     const result = await this.dbService.addNewRecord("dy_user", fieldNames, fieldValues);

//     // Set custom claims for the user in Firebase
//     await admin.auth().setCustomUserClaims(uid, { role: roleName });

//     // Respond with success and return the generated token
//     res.status(201).json({
//       message: "User registered and logged in successfully.",
//       token,
//       uid,
//       role: roleName, // Sending the role name
//       email,
//     });
//   } catch (err) {
//     console.error("Error during Google login:", err.message);
//     res.status(500).json({ message: "Internal server error." });
//   }
// }




//   async login(req, res) {
//     const { uid, token } = req.body;
//     console.log("token and uid", req.body);
//     if (!uid) {
//       return res.status(400).json({ message: "UID is required." });
//     }

//     try {
//       // Check if the user exists in the database
//       const existingUser = await this.dbService.getRecordsByFields(
//         "dy_user",
//         "*",
//         `uid = ${db.escape(uid)}`
//       );

//       if (existingUser.length === 0) {
//         return res.status(404).json({ message: "User not found. Please signup first." });
//       }

//       const user = existingUser[0];

//       // Generate a Firebase token (role_id is included in custom claims)
//       const decodedToken = await admin.auth().verifyIdToken(token);
//       console.log("role_id: ", decodedToken);
//       res.status(200).json({
//         message: "Login successful.",
//         email:decodedToken.email,
//         uid:uid,
//         token,
//         role:decodedToken.role
//       });
//     } catch (err) {
//       console.error("Error during login:", err.message);
//       res.status(500).json({ message: "Internal server error." });
//     }
//   }

//   // async verifyToken(req, res, next) {
//   //   const idToken = req.headers.authorization?.split(" ")[1]; // Bearer token

//   //   if (!idToken) {
//   //     return res.status(401).json({ message: "Unauthorized: No token provided." });
//   //   }

//   //   try {
//   //     const decodedToken = await admin.auth().verifyIdToken(idToken);

//   //     // Attach user data and custom claims to the request object
//   //     req.user = decodedToken;

//   //     // Example: Access role_id from the token
//   //     console.log("User Role ID:", decodedToken);

//   //     next();
//   //   } catch (err) {
//   //     console.error("Token verification error:", err.message);
//   //     res.status(401).json({ message: "Unauthorized: Invalid token." });
//   //   }
//   // }

//   async blockUser(req, res) {
//     const { uid } = req.params; // Extract UID from request parameters
//     console.log("User ID:", uid);
  
//     if (!uid) {
//       return res.status(400).json({ message: "UID is required." });
//     }
  
//     try {
//       // Disable the user account
//       await admin.auth().updateUser(uid, { disabled: true });
//       console.log(`User with UID ${uid} has been blocked.`);
//       return res.status(200).json({
//         success: true,
//         message: `User with UID ${uid} has been blocked.`,
//       });
//     } catch (error) {
//       console.error(`Error blocking user with UID ${uid}:`, error.message);
//       return res.status(500).json({
//         success: false,
//         message: `Failed to block user: ${error.message}`,
//       });
//     }
//   }
  
//   async unblockUser(req, res) {
//     const { uid } = req.params; // Extract UID from request parameters
//     console.log("User ID:", uid);
  
//     if (!uid) {
//       return res.status(400).json({ message: "UID is required." });
//     }
  
//     try {
//       // Enable the user account
//       await admin.auth().updateUser(uid, { disabled: false });
//       console.log(`User with UID ${uid} has been unblocked.`);
//       return res.status(200).json({
//         success: true,
//         message: `User with UID ${uid} has been unblocked.`,
//       });
//     } catch (error) {
//       console.error(`Error unblocking user with UID ${uid}:`, error.message);
//       return res.status(500).json({
//         success: false,
//         message: `Failed to unblock user: ${error.message}`,
//       });
//     }
//   }
  
// }

// module.exports = AuthController;






// const admin = require("firebase-admin");
// const db = require("../config/db");
// const dotenv = require("dotenv");
// const DatabaseService = require("../utils/service");

// dotenv.config();

// admin.initializeApp({
//   credential: admin.credential.cert(require('../config/firebase_admin.json')),
// });


// class AuthController {
//   constructor() {
//     this.dbService = new DatabaseService();
//   }

//   async signup(req, res) {
//     const { uid, email, displayName, mobile_no, role_id, token } = req.body;

//     // Check for required fields
//     if (!uid || !email || !role_id || !token) {
//       return res.status(400).json({ message: "Required fields are missing." });
//     }

//     try {
//       // Check if the user already exists
//       const existingUser = await this.dbService.getRecordsByFields(
//         "dy_user",
//         "*",
//         `uid = ${db.escape(uid)}`
//       );

//       if (existingUser.length > 0) {
//         return res.status(409).json({ message: "User already exists. Please login." });
//       }

//       // Fetch the role name based on role_id from the roles table
//       const roleResults = await this.dbService.getRecordsByFields(
//         "st_role",
//         "role",
//         `id = ${db.escape(role_id)}`
//       );
//       const roleName = roleResults.length > 0 ? roleResults[0].role : null;

//       if (!roleName) {
//         return res.status(400).json({ message: "Invalid role_id. Role not found." });
//       }

//       // Prepare and add the new user to the database
//       const fieldNames = "uid, user_name, email_id, mobile_no, role_id";
//       const fieldValues = `${db.escape(uid)}, ${db.escape(displayName || null)}, ${db.escape(email)}, ${db.escape(mobile_no || null)}, ${db.escape(role_id)}`;
//       const result = await this.dbService.addNewRecord("dy_user", fieldNames, fieldValues);
//          // Respond with success and necessary details
//       res.status(201).json({
//         message: "User registered successfully.",
//         token,
//         uid,
//         role: roleName,
//         email:email,
//       });
//     } catch (err) {
//       console.error("Error during signup:", err.message);
//       res.status(500).json({ message: "Internal server error." });
//     }
//   }

//   async g_login(req, res) {
//   const { uid, email, displayName, mobile_no, token, role_id } = req.body;

//   // Check if required fields are provided
//   if (!uid || !email || !token) {
//     return res.status(400).json({ message: "Required fields are missing." });
//   }

//   try {
//     // Check if the user exists in the database
//     const existingUser = await this.dbService.getRecordsByFields(
//       "dy_user",
//       "*",
//       `uid = ${db.escape(uid)}`
//     );

//     const assignedRoleId = role_id || 2; // Assign role_id from input or default to 2

//     // Fetch the role name based on the assigned role_id from the roles table
//     const roleResults = await this.dbService.getRecordsByFields(
//       "st_role",
//       "role",
//       `id = ${db.escape(assignedRoleId)}`
//     );
//     const roleName = roleResults.length > 0 ? roleResults[0].role : null;

//     if (!roleName) {
//       return res.status(400).json({ message: "Invalid role_id. Role not found." });
//     }
//     if (existingUser.length > 0) {
//       // User already exists, generate and return token
//       return res.status(200).json({
//         message: "Login successful.",
//         token,
//         uid,
//         role: roleName, // Assuming `role_id` is stored in the user record
//         email: existingUser[0].email_id,
//         username: existingUser[0].user_name
//       });
//     }

//     // If user does not exist, create a new user


//     // Prepare and add the new user to the database
//     const fieldNames = "uid, user_name, email_id, mobile_no, role_id";
//     const fieldValues = `${db.escape(uid)}, ${db.escape(displayName || null)}, ${db.escape(email)}, ${db.escape(mobile_no)}, ${db.escape(assignedRoleId)}`;
//     const result = await this.dbService.addNewRecord("dy_user", fieldNames, fieldValues);

   
//     // Respond with success and return the generated token
//     res.status(201).json({
//       message: "User registered and logged in successfully.",
//       token,
//       uid,
//       role: roleName,
//       email,
//     });
//   } catch (err) {
//     console.error("Error during Google login:", err.message);
//     res.status(500).json({ message: "Internal server error." });
//   }
// }



//   async login(req, res) {
//     const { uid, token } = req.body;
//     console.log("token and uid", req.body);
//     if (!uid) {
//       return res.status(400).json({ message: "UID is required." });
//     }

//     try {
//       // Check if the user exists in the database
//       const existingUser = await this.dbService.getRecordsByFields(
//         "dy_user",
//         "*",
//         `uid = ${db.escape(uid)}`
//       );

//       if (existingUser.length === 0) {
//         return res.status(404).json({ message: "User not found. Please signup first." });
//       }



//       const user = existingUser[0];

//       const roleResults = await this.dbService.getRecordsByFields(
//         "st_role",
//         "role",
//         `id = ${db.escape(user.role_id)}`
//       );
//       const roleName = roleResults.length > 0 ? roleResults[0].role : null;
  
//       if (!roleName) {
//         return res.status(400).json({ message: "Invalid role_id. Role not found." });
//       }

//       // Generate a Firebase token (role_id is included in custom claims)
    
//       res.status(200).json({
//         message: "Login successful.",
//         email:user.email,
//         uid:uid,
//         token,
//         role:roleName,
//         username:user.user_name
//       });
//     } catch (err) {
//       console.error("Error during login:", err.message);
//       res.status(500).json({ message: "Internal server error." });
//     }
//   }

//   // async verifyToken(req, res, next) {
//   //   const idToken = req.headers.authorization?.split(" ")[1]; // Bearer token

//   //   if (!idToken) {
//   //     return res.status(401).json({ message: "Unauthorized: No token provided." });
//   //   }

//   //   try {
//   //     const decodedToken = await admin.auth().verifyIdToken(idToken);

//   //     // Attach user data and custom claims to the request object
//   //     req.user = decodedToken;

//   //     // Example: Access role_id from the token
//   //     console.log("User Role ID:", decodedToken);

//   //     next();
//   //   } catch (err) {
//   //     console.error("Token verification error:", err.message);
//   //     res.status(401).json({ message: "Unauthorized: Invalid token." });
//   //   }
//   // }

//   async blockUser(req, res) {
//     const { uid } = req.params; // Extract UID from request parameters
//     console.log("User ID:", uid);
  
//     if (!uid) {
//       return res.status(400).json({ message: "UID is required." });
//     }
  
//     try {
//       // Disable the user account
//       await admin.auth().updateUser(uid, { disabled: true });
//       console.log(`User with UID ${uid} has been blocked.`);
//       return res.status(200).json({
//         success: true,
//         message: `User with UID ${uid} has been blocked.`,
//       });
//     } catch (error) {
//       console.error(`Error blocking user with UID ${uid}:`, error.message);
//       return res.status(500).json({
//         success: false,
//         message: `Failed to block user: ${error.message}`,
//       });
//     }
//   }
  
//   async unblockUser(req, res) {
//     const { uid } = req.params; // Extract UID from request parameters
//     console.log("User ID:", uid);
  
//     if (!uid) {
//       return res.status(400).json({ message: "UID is required." });
//     }
  
//     try {
//       // Enable the user account
//       await admin.auth().updateUser(uid, { disabled: false });
//       console.log(`User with UID ${uid} has been unblocked.`);
//       return res.status(200).json({
//         success: true,
//         message: `User with UID ${uid} has been unblocked.`,
//       });
//     } catch (error) {
//       console.error(`Error unblocking user with UID ${uid}:`, error.message);
//       return res.status(500).json({
//         success: false,
//         message: `Failed to unblock user: ${error.message}`,
//       });
//     }
//   }
  
// }

// module.exports = AuthController;



const db = require("../config/db");
const dotenv = require("dotenv");
const DatabaseService = require("../utils/service");

dotenv.config();

class AuthController {
  constructor() {
    this.dbService = new DatabaseService();
  }

  async fetchRoleName(roleId) {
    const roleResults = await this.dbService.getRecordsByFields(
      "st_role",
      "role",
      `id = ${db.escape(roleId)}`
    );
    return roleResults.length > 0 ? roleResults[0].role : null;
  }

  validateFields(fields, requiredFields) {
    const missingFields = requiredFields.filter((field) => !fields[field]);
    return missingFields.length > 0
      ? `Missing required fields: ${missingFields.join(", ")}`
      : null;
  }

  async signup(req, res) {
    const { uid, email, displayName, mobile_no, role_id, token } = req.body;
    const validationError = this.validateFields(req.body, [
      "uid",
      "email",
      "role_id",
      "token",
    ]);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    try {
      const existingUser = await this.dbService.getRecordsByFields(
        "dy_user",
        "*",
        `uid = ${db.escape(uid)}`
      );
      if (existingUser.length > 0) {
        return res.status(409).json({ message: "User already exists. Please login." });
      }

      const roleName = await this.fetchRoleName(role_id);
      if (!roleName) {
        return res.status(400).json({ message: "Invalid role_id. Role not found." });
      }

      const fieldNames = "uid, user_name, email_id, mobile_no, role_id";
      const fieldValues = `${db.escape(uid)}, ${db.escape(displayName || null)}, ${db.escape(email)}, ${db.escape(mobile_no || null)}, ${db.escape(role_id)}`;
      const ress=await this.dbService.addNewRecord("dy_user", fieldNames, fieldValues);
      console.log("response", ress);
      res.status(201).json({
        message: "User registered successfully.",
        token,
        uid,
        role: roleName,
        email,
        username:displayName||null,
      });
    } catch (err) {
      console.error("Error during signup:", err.message);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  // async g_login(req, res) {
  //   const { uid, email, displayName, mobile_no, token, role_id } = req.body;
  //   const validationError = this.validateFields(req.body, ["uid", "email", "token"]);
  //   if (validationError) {
  //     return res.status(400).json({ message: validationError });
  //   }

  //   try {
  //     const existingUser = await this.dbService.getRecordsByFields(
  //       "dy_user",
  //       "*",
  //       `uid = ${db.escape(uid)}`
  //     );

  //     const assignedRoleId = role_id || 2;
  //     const roleName = await this.fetchRoleName(assignedRoleId);
  //     if (!roleName) {
  //       return res.status(400).json({ message: "Invalid role_id. Role not found." });
  //     }

  //     if (existingUser.length > 0) {
  //       return res.status(200).json({
  //         message: "Login successful.",
  //         token,
  //         uid,
  //         role: roleName,
  //         email: existingUser[0].email_id,
  //         username: existingUser[0].user_name,
  //       });
  //     }

  //     const fieldNames = "uid, user_name, email_id, mobile_no, role_id";
  //     const fieldValues = `${db.escape(uid)}, ${db.escape(displayName || null)}, ${db.escape(email)}, ${db.escape(mobile_no)}, ${db.escape(assignedRoleId)}`;
  //     await this.dbService.addNewRecord("dy_user", fieldNames, fieldValues);

  //     res.status(201).json({
  //       message: "User registered and logged in successfully.",
  //       token,
  //       uid,
  //       role: roleName,
  //       email,
  //     });
  //   } catch (err) {
  //     console.error("Error during Google login:", err.message);
  //     res.status(500).json({ message: "Internal server error." });
  //   }
  // }

  async g_login(req, res) {
    const { uid, email, displayName, mobile_no, token, role_id } = req.body;
  
    // Check if required fields are provided
    if (!uid || !email || !token) {
      return res.status(400).json({ message: "Required fields are missing." });
    }
  
    try {
      // Check if the user exists in the database
      const existingUser = await this.dbService.getRecordsByFields(
        "dy_user",
        "*",
        `uid = ${db.escape(uid)}`
      );
  
      if (existingUser.length > 0) {
        // Extract role_id and fetch the corresponding role name
        const user = existingUser[0];
        const assignedRoleId = user.role_id;
  
        const roleResults = await this.dbService.getRecordsByFields(
          "st_role",
          "role",
          `id = ${db.escape(assignedRoleId)}`
        );
  
        const roleName = roleResults.length > 0 ? roleResults[0].role : null;
  
        if (!roleName) {
          return res.status(400).json({ message: "Invalid role_id. Role not found." });
        }
  
        // User already exists, return token and user details
        return res.status(200).json({
          message: "Login successful.",
          token,
          uid,
          role: roleName,
          id:user.id,
          email: user.email_id,
          username: user.user_name,
        });
      }
  
      // If user does not exist, create a new user
      const assignedRoleId = role_id || 2; // Default to role_id = 2 if not provided
  
      // Fetch the role name for the new user
      const roleResults = await this.dbService.getRecordsByFields(
        "st_role",
        "role",
        `id = ${db.escape(assignedRoleId)}`
      );
      const roleName = roleResults.length > 0 ? roleResults[0].role : null;
  
      if (!roleName) {
        return res.status(400).json({ message: "Invalid role_id. Role not found." });
      }
  
      // Prepare and add the new user to the database
      const fieldNames = "uid, user_name, email_id, mobile_no, role_id";
      const fieldValues = `${db.escape(uid)}, ${db.escape(displayName || null)}, ${db.escape(email)}, ${db.escape(mobile_no)}, ${db.escape(assignedRoleId)}`;
       await this.dbService.addNewRecord("dy_user", fieldNames, fieldValues);
      
      const usr = await this.dbService.getRecordsByFields(
        "dy_user",
        "*",
        `uid = ${db.escape(uid)}`
      );


      console.log("new user", usr);
      // Respond with success and return the generated token
      res.status(201).json({
        message: "User registered and logged in successfully.",
        token,
        uid,
        role: roleName,
        email,
        id:usr[0].id,
        username:displayName || null,
      });
    } catch (err) {
      console.error("Error during Google login:", err.message);
      res.status(500).json({ message: "Internal server error." });
    }
  }
  

  async login(req, res) {
    const { uid, token } = req.body;

    if (!uid) {
      return res.status(400).json({ message: "UID is required." });
    }

    try {
      const existingUser = await this.dbService.getRecordsByFields(
        "dy_user",
        "*",
        `uid = ${db.escape(uid)}`
      );

      if (existingUser.length === 0) {
        return res.status(404).json({ message: "User not found. Please signup first." });
      }

      const user = existingUser[0];
      const roleName = await this.fetchRoleName(user.role_id);
      if (!roleName) {
        return res.status(400).json({ message: "Invalid role_id. Role not found." });
      }

      res.status(200).json({
        message: "Login successful.",
        email: user.email_id,
        uid,
        token,
        role: roleName,
        id:user.id,
        username: user.user_name,
      });
    } catch (err) {
      console.error("Error during login:", err.message);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  async blockUser(req, res) {
    const { uid } = req.params;

    if (!uid) {
      return res.status(400).json({ message: "UID is required." });
    }

    try {
      console.log(`Blocking user with UID: ${uid}`);
      return res.status(200).json({
        success: true,
        message: `User with UID ${uid} has been blocked.`,
      });
    } catch (err) {
      console.error("Error blocking user:", err.message);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  async unblockUser(req, res) {
    const { uid } = req.params;

    if (!uid) {
      return res.status(400).json({ message: "UID is required." });
    }

    try {
      console.log(`Unblocking user with UID: ${uid}`);
      return res.status(200).json({
        success: true,
        message: `User with UID ${uid} has been unblocked.`,
      });
    } catch (err) {
      console.error("Error unblocking user:", err.message);
      res.status(500).json({ message: "Internal server error." });
    }
  }
}

module.exports = AuthController;
