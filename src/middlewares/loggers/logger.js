const winston = require("winston");

// Defining our security levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env || "development";

  return isDevelopment ? "debug" : "warn";
};

// Define different colors for each level
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Choose the aspect of your log customizing the log format
const format = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DDTHH:mm:ss",
  }),

  winston.format.colorize({ all: true }),

  // Define the format of the message showing the timestamp, the level and the message
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define the transports that logger must use to print out messages
const transports = [
  // Allow the user to console to print the message
  new winston.transports.Console(),

  // Allow to print all the error level messages inside the error.log file
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
  }),

  // Allow to print all the error level messages inside the all.log file
  new winston.transports.File({
    filename: "logs/all.log",
  }),
];

const Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
  exitOnError: false,
});

module.exports = Logger;
