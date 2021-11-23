import { createLogger, format, transports } from "winston";

const alignColorAndTime = format.combine(
    format.colorize({
        all: true
    }),
    format.label({
        label: '[LOGGER]'
    }),
    format.timestamp({
        format: "YY-MM-DD HH:MM:SS"
    }),
    format.printf(
        info => `${info.label} ${info.timestamp} ${info.level} : ${info.message}`
    )
)
export const logger = createLogger({
    transports: [new transports.Console({ //can use file instead of console but there should be filename property
        //filename: "info.log",// only use this if there is  file instead of console
        level: "info",
        format: format.combine(format.json(), alignColorAndTime), //can use simple instead of json,

    })]
})