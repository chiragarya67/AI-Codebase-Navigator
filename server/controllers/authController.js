
const User = require("../models/User");
const jwt = require("jsonwebtoken");


const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, // Payload: data stored inside the token
    process.env.JWT_SECRET, // Secret key: used to sign/verify the token
    { expiresIn: "7d" } // Token expires in 7 days
  );
};



const signup = async (req, res) => {
  try {
    // Step 1: Get data from the request body
    const { name, email, password } = req.body;

    // Step 2: Validate - make sure all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    // Step 3: Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    // Step 4: Create the new user (password gets hashed automatically by the pre-save hook)
    const user = await User.create({ name, email, password });

    // Step 5: Generate a JWT token for the new user
    const token = generateToken(user._id);

    // Step 6: Send back the user data and token
    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          reposAnalyzed: user.reposAnalyzed,
          chatMessages: user.chatMessages,
          dailyUsage: user.dailyUsage,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong during signup",
    });
  }
};

const login = async (req, res) => {
  try {
    // Step 1: Get email and password from the request body
    const { email, password } = req.body;

    // Step 2: Validate - make sure both fields are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Step 3: Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Step 4: Check if the password matches
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Step 5: Generate a JWT token
    const token = generateToken(user._id);

    // Step 6: Send back the user data and token
    res.status(200).json({
      success: true,
      message: "Login successful!",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          reposAnalyzed: user.reposAnalyzed,
          chatMessages: user.chatMessages,
          dailyUsage: user.dailyUsage,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong during login",
    });
  }
};

const getMe = async (req, res) => {
  try {
    // req.user is set by the auth middleware (it decoded the token)
    const user = await User.findById(req.user.id).select("-password");
    // .select("-password") means: get all fields EXCEPT password

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("GetMe Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const incrementUsage = async (req, res) => {
  try {
    const { type } = req.body; // "repo" or "chat"
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Reset daily counters if it's a new day
    if (user.dailyUsage.date !== today) {
      user.dailyUsage = { date: today, repoCount: 0, chatCount: 0 };
    }

    // Plan limits
    const limits = { free: { repo: 5, chat: 10 }, pro: { repo: 50, chat: 9999 }, premium: { repo: 9999, chat: 9999 } };
    const planLimits = limits[user.plan] || limits.free;

    if (type === "repo") {
      if (user.dailyUsage.repoCount >= planLimits.repo) {
        return res.status(429).json({ success: false, message: `Daily limit reached (${planLimits.repo} repos/day). Upgrade your plan for more.` });
      }
      user.dailyUsage.repoCount += 1;
      user.reposAnalyzed += 1;
    } else if (type === "chat") {
      if (user.dailyUsage.chatCount >= planLimits.chat) {
        return res.status(429).json({ success: false, message: `Daily chat limit reached. Upgrade your plan for more.` });
      }
      user.dailyUsage.chatCount += 1;
      user.chatMessages += 1;
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        reposAnalyzed: user.reposAnalyzed,
        chatMessages: user.chatMessages,
        dailyUsage: user.dailyUsage,
        plan: user.plan,
      },
    });
  } catch (error) {
    console.error("Usage Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to update usage" });
  }
};

// Export all controller functions
module.exports = { signup, login, getMe, incrementUsage };
