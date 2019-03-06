'use strict';

const methodMap = {
	'ObjectCreated:*': 'post',
	'ObjectCreated:Put': 'post',
	'ObjectCreated:Post': 'post',
	'ObjectCreated:Copy': 'post',
	'ObjectCreated:CompleteMultipartUpload': 'post',
	'ObjectRemoved:*': 'delete',
	'ObjectRemoved:Delete': 'delete',
	'ObjectRemoved:DeleteMarkerCreated': 'delete',
	'ObjectRestore:Post': 'post',
	'ObjectRestore:Completed': 'post',
	ReducedRedundancyLostObject: 'post'
};

module.exports = () => {
	return ctx => {
		if (!ctx.path && ctx.req.Records && ctx.req.Records.length === 1 && ctx.req.Records[0].eventSource === 'aws:s3') {
			const record = ctx.req.Records[0];
			const s3triggerName = record.s3.configurationId;

			ctx.request.body = ctx.req.Records.map(record => ({
				bucket: record.s3.bucket.name,
				key: record.s3.object.key,
				eventName: record.eventName
			}));

			Object.defineProperty(ctx, 'path', {enumerable: true, value: `s3:${s3triggerName}`});
			Object.defineProperty(ctx, 'method', {enumerable: true, value: methodMap[record.eventName]});
		}
	};
};
