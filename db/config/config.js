db.createUser(
  {
      user: "api",
      pwd: passwordPrompt(),
      roles: [
        { role: "readWrite", db: "iauu" }
      ]
  });