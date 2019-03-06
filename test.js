import test from 'ava';
import braggS3Middleware from '.';

const s3Record = {
	eventVersion: '2.1',
	eventSource: 'aws:s3',
	awsRegion: 'eu-west-1',
	eventTime: '2019-03-01T16:18:57.771Z',
	eventName: 'ObjectCreated:Put',
	userIdentity: {
		principalId: 'AWS:AIDAJVAB27S2NJBQLG2SM'
	},
	requestParameters: {
		sourceIPAddress: '11.22.123.456'
	},
	responseElements: {
		'x-amz-request-id': 'C722FB7FC601B2C9',
		'x-amz-id-2': 'B3nPwwlDI1DOMu8yOQNUUn+NetaJyCfqH5fLiQqkfoJ4wyn0ibr30BJQ/yvpkaAngQuDV68m4rk='
	},
	s3: {
		s3SchemaVersion: '1.0',
		configurationId: 's3TestEvent',
		bucket: {
			name: 'test.bucket',
			ownerIdentity: {
				principalId: 'AEQWEDCCQWE'
			},
			arn: 'arn:aws:s3:::test.bucket'
		},
		object: {
			key: 'test/placeholder2.json',
			size: 4,
			eTag: 'cbd8f7984c654c25DDSDADQDQDSAD',
			sequencer: '005C795B711111115'
		}
	}
};

const snsRecord = {
	EventVersion: '1.0',
	EventSubscriptionArn: 'arn:aws:sns:EXAMPLE',
	EventSource: 'aws:sns',
	Sns: {
		SignatureVersion: '1',
		Timestamp: '1970-01-01T00:00:00.000Z',
		Signature: 'EXAMPLE',
		SigningCertUrl: 'EXAMPLE',
		MessageId: '95df01b4-ee98-5cb9-9903-4c221d41eb5e',
		Message: 'Hello from SNS!',
		MessageAttributes: {
			Test: {
				Type: 'String',
				Value: 'TestString'
			},
			TestBinary: {
				Type: 'Binary',
				Value: 'TestBinary'
			}
		},
		Type: 'Notification',
		UnsubscribeUrl: 'EXAMPLE',
		TopicArn: 'arn:aws:sns:EXAMPLE',
		Subject: 'TestInvoke'
	}
};

test('middleware should process a S3 event', t => {
	const ctx = {
		req: {
			Records: [s3Record]
		},
		request: {}
	};

	braggS3Middleware()(ctx);

	t.deepEqual(ctx, {
		req: {
			Records: [s3Record]
		},
		request: {
			body: [
				{
					bucket: 'test.bucket',
					key: 'test/placeholder2.json',
					eventName: 'ObjectCreated:Put'
				}
			]
		},
		path: 's3:s3TestEvent',
		method: 'post'
	});
});

test('should ignore SNS events', t => {
	const ctx = {
		req: {
			Records: [snsRecord]
		},
		request: {}
	};

	braggS3Middleware()(ctx);

	t.deepEqual(ctx, {
		req: {
			Records: [snsRecord]
		},
		request: {}
	});
});
