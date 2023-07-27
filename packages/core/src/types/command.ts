export interface Command {
  handle(): Promise<void>;
}
