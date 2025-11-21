const users = [
  {
    id: 1,
    name: "Admin",
    username: "adminn",
    email: "admin@mail.com",
  },
];

module.exports = {
  get: (req, res) => {
    const userResponse = users.map((u) => ({
      id: u.id,
      name: u.name,
      username: u.username,
      email: u.email,
    }));
    return res.json({
      success: true,
      data: userResponse,
      message: "Data Retrieved Successfully",
      code: 200,
    });
  },

  create: (req, res) => {
    const { name, username, email, password } = req.body;

    const id = users.length + 1;

    if (name == "" || !name) {
      return res.status(400).json({
        success: false,
        message: "name is required",
        code: 400,
      });
    }

    if (username == "" || !username) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "username is required",
        code: 400,
      });
    }

    if (email == "" || !email) {
      return res.status(400).json({
        success: false,
        message: "email is required",
        code: 400,
      });
    }

    if (password == "" || !password) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "password is required",
        code: 400,
      });
    }

    if (users.some((u) => u.username === username)) {
      return res.status(400).json({
        success: false,
        message: "username already exists",
        code: 400,
      });
    }

    if (users.some((u) => u.email === email)) {
      return res.status(400).json({
        success: false,
        message: "email already exists",
        code: 400,
      });
    }

    users.push({ id, username, email, password, name });

    const userResponse = { id, name, username, email };

    return res.status(201).json({
      success: true,
      data: userResponse,
      message: "Data Created Successfully",
      code: 201,
    });
  },

  getDetailById: (req, res) => {
    const id = Number(req.params.id);

    const user = users.find((u) => u.id === id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "data not found",
        code: 404,
      });
    }

    const userResponse = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
    };

    return res.status(200).json({
      success: true,
      data: userResponse,
      message: "data retrieved Successfully",
      code: 200,
    });
  },

  update: (req, res) => {
    const id = Number(req.params.id);

    const user = users.find((u) => u.id === id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "data not found",
        code: 404,
      });
    }

    const { name, username, email, password } = req.body;

    if (username && users.some((u) => u.username === username && u.id !== id)) {
      return res.status(400).json({
        success: false,
        message: "username already exists",
        code: 400,
      });
    }

    if (email && users.some((u) => u.email === email && u.id !== id)) {
      return res.status(400).json({
        success: false,
        message: "email already exists",
        code: 400,
      });
    }

    if (name) user.name = name;
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;

    const userResponse = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
    };

    return res.status(201).json({
      success: true,
      data: userResponse,
      message: "data updated successfully",
      code: 201,
    });
  },

  delete: (req, res) => {
    const id = req.params.id;

    const userIndex = users.findIndex((u) => u.id == id);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "data not found",
        code: 404,
      });
    }

    users.splice(userIndex, 1);

    return res.status(201).json({
      success: true,
      message: "data deleted successfully",
      code: 201,
    });
  },
};
