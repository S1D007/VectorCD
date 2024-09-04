const fs = require("fs");
const path = require("path");
const os = require("os");

const getSettingsPath = () => {
  const platform = os.platform();

  if (platform === "win32") {
    return path.join(process.env.APPDATA, "Code", "User", "settings.json");
  } else if (platform === "darwin") {
    return path.join(
      os.homedir(),
      "Library",
      "Application Support",
      "Code",
      "User",
      "settings.json"
    );
  } else if (platform === "linux") {
    return path.join(os.homedir(), ".config", "Code", "User", "settings.json");
  } else {
    throw new Error(`[ERROR] Unsupported platform: ${platform}`);
  }
};

const settingsPath = getSettingsPath();

if (!fs.existsSync(settingsPath)) {
  console.error(
    "VS Code settings file not found. Ensure that VS Code is installed and has been launched at least once."
  );
  process.exit(1);
}

const applySchema = () => {
  const settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));

  if (!settings["json.schemas"]) {
    settings["json.schemas"] = [];
  }
  settings["json.schemas"].push({
    fileMatch: ["/.vector"],
    url: "https://raw.githubusercontent.com/S1D007/VectorCD/main/vector.schema.json",
  });

  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  console.log("Vector schema has been applied to VS Code.");
};

const applyIcon = () => {
  const extensionsPath = path.join(
    os.homedir(),
    ".vscode",
    "extensions",
    "vector-icon-theme"
  );
  const iconPath = path.join(extensionsPath, "vectorcd.svg");

  if (!fs.existsSync(extensionsPath)) {
    fs.mkdirSync(extensionsPath, { recursive: true });
  }

  fs.copyFileSync(path.join(__dirname, "logo.svg"), iconPath);

  const iconThemeSettings = {
    iconDefinitions: {
      vectorFile: {
        iconPath: "./vectorcd.svg",
      },
    },
    fileExtensions: {
      vector: "vectorFile",
    },
  };

  fs.writeFileSync(
    path.join(extensionsPath, "vector-icon-theme.json"),
    JSON.stringify(iconThemeSettings, null, 2)
  );
  console.log(
    "Vector icon theme has been set up. You may need to select the theme manually in VS Code."
  );
}

applySchema();
applyIcon();
