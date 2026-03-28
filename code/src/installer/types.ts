export type PackageMetadata = {
  name: string;
  version: string;
};

export type InstallPaths = {
  installRoot: string;
  serverEntry: string;
  skillsRoot: string;
  agentPath: string;
  readmePath: string;
  manifestPath: string;
};
