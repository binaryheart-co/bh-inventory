require("../../setup/db");
const DeviceModel = require("../../models/device");

const importDevices = async () => {
    const Papa = require("./papaparse.min");
    const { fs } = require("file-system");
    const path = require("path");
    return new Promise((resolve, reject) => {
        const location = path.join(__dirname, ".", "data.csv");
        fs.readFile(location, (err, data) => {
            Papa.parse(data.toString(), {
                header: true,
                complete: (results) => {
                    const formatted = results.data.map((e) => {
                        const newDate = new Date(e.Date)
                        const ne = {
                            date: newDate,
                            fullID: e["ID"],
                            code: +e.Code,
                            description: e.Description.replace(/\n/g, ", "),
                            receiver: e.Receiver,
                            price: +e.price
                        }
                        if(e.Notes.includes(":")) {
                            const notesRaw = e.Notes.split("\n");
                            ne.notes = notesRaw.map((e2) => {
                                const noteParts = e2.split(": ");
                                const noteDate = new Date(noteParts[0]);
                                return { createdAt: noteDate, note: noteParts[1], code: +e.Code };
                            });
                        }
                        else if (e.Notes !== "") ne.notes = [{ 
                            createdAt: newDate, 
                            note: e.Notes.replace(/\n/g, ", "), 
                            code: +e.Code,
                        }]
                        return ne;
                    });
                    resolve(formatted);
                }
            })
        });
    });
}

const saveDevices = async () => {
    try {
        const devices = await importDevices();
        const save = devices.map(async (e, i) => {
            const dData = {
                createdAt: e.date,
                fullID: e.fullID,
                weekYr: e.fullID.substring(0, 4),
                weekDevice: +e.fullID.substring(4, 7),
                uniqueID: e.fullID.substring(0, 7),
                type: e.fullID.substring(7, 8),
                code: e.code,
                notes: e.notes,
                description: e.description,
                estValue: e.price
            };
            if(e.receiver !== "") dData.receiver = e.receiver;
            const device = new DeviceModel(dData);
            await device.save();
        });
        await Promise.all(save);
        console.log("Done! All devices saved!");
    } 
    catch (error) {
        console.error(error);
    }
}

saveDevices();