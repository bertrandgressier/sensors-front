var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    config = require('../config'),
    cors = require('cors'),
    port = process.env.PORT || 3000,
    app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose.connect(config.mongoDB);

var sensorSchema = mongoose.Schema({
    id: String,
    type: String,
    timestamp: Date,
    value: Number
});

var Sensor = mongoose.model('Sensor', sensorSchema);

var router = express.Router();
router.route('/api/sensor')
    .get(function (req, res) {
        Sensor.find(function (err, sensor) {
            if (err) {
                res.send(err);
            }
            res.send(sensor);
        });
    });

router.route('/api/sensor/:sensor_id')
    .get(function (req, res) {
        Sensor.findOne({_id: req.params.sensor_id}, function (err, sensor) {
            if (err) {
                res.send(err);
            }
            res.send(sensor);
        });
    });

router.route('/api/sensors')
    .get(function (req, res) {
        var currentDate = new Date();

        Sensor.aggregate()
            .match({type: 'V_TEMP'})
            .project({
                hour: {$hour: "$timestamp"},
                dayOfMonth: {$dayOfMonth: "$timestamp"},
                month: {$month: "$timestamp"},
                year: {$year: "$timestamp"},
                timestamp: 1,
                value: 1,
                type: 1
            })
            .group({
                _id: {type: "$type", year: "$year", month: "$month", dayOfMonth: "$dayOfMonth", hour: "$hour"},
                avg: {$avg: "$value"},
                last: {$last: "$value"}
            })
            // only the results of current day
            .match({
                "_id.year": currentDate.getFullYear(),
                "_id.month": currentDate.getMonth() + 1,
                "_id.dayOfMonth": currentDate.getDate()
            })
            .sort({"_id.hour": 1})
            //.sort({"_id.year": 1, "_id.month": 1, "_id.dayOfMonth": 1, "_id.hour": 1})
            .exec(function (err, sensors) {
                if (err) {
                    res.send(err);
                }
                res.send(sensors);
            });
    });

app.use(router);
app.listen(port, function () {
    console.log('listening on port ' + port);
});