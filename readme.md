# bragg-s3 [![Build Status](https://travis-ci.org/SimonJang/bragg-s3.svg?branch=master)](https://travis-ci.org/SimonJang/bragg-s3)

> [bragg](https://github.com/SamVerschueren/bragg) middleware to process s3 triggers


## Install

```
$ npm install bragg-s3
```

## Routing

The routing is decided based on the event [type](https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html#supported-notification-event-types)

| Event name  | Method  |
|---|---|
| ObjectCreated:* | post |
| ObjectCreated:Put | post |
| ObjectCreated:Post | post |
| ObjectCreated:Copy | post |
| ObjectCreated:CompleteMultipartUpload | post |
| ObjectRemoved:* | delete |
| ObjectRemoved:Delete | delete |
| ObjectRemoved:DeleteMarkerCreated | delete |
| ObjectRestore:Post | post |
| ObjectRestore:Completed | post |
| ReducedRedundancyLostObject | post |


## Usage

```js
const app = require('bragg')();
const router = require('bragg-router')();
const s3 = require('bragg-s3');

// Listen for events in the `TopicName` topic
router.post('s3:triggerName', ctx => {
    ctx.body = ctx.request.body; // [{bucket: 'someBucket', key: 'foo.jpg', eventName: 'ObjectCreated:Put'}]
});

app.use(s3());
app.use(router.routes());

exports.handler = app.listen();
```

The `s3:` prefix is added before the name of the S3 trigger. The `bucket`, `key` and `eventName` are provided in the `body` of the `request` object. Routing is decided by the `configurationId` provided in the request. This can be a UUID when the trigger is created using AWS CloudFormation.

## API

### braggS3()

Add the bragg S3 middleware to the middleware pipeline.

## License

MIT © [Simon](https://github.com/SimonJang)
