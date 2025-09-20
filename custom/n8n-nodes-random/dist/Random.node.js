"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Random = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class Random {
    description = {
        displayName: 'Random.org',
        name: 'random',
        icon: 'fa:random',
        group: ['utility'],
        version: 1,
        subtitle: '={{$parameter["operation"]}}',
        description: 'Generate true random numbers using Random.org API',
        defaults: {
            name: 'Random.org',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [],
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Generate Integer',
                        value: 'integer',
                        description: 'Generate random integers',
                        action: 'Generate random integers',
                    },
                    {
                        name: 'Generate Decimal',
                        value: 'decimal',
                        description: 'Generate random decimal numbers',
                        action: 'Generate random decimal numbers',
                    },
                ],
                default: 'integer',
            },
            {
                displayName: 'Minimum Value',
                name: 'min',
                type: 'number',
                default: 1,
                description: 'Minimum value (inclusive)',
                displayOptions: {
                    show: {
                        operation: ['integer', 'decimal'],
                    },
                },
            },
            {
                displayName: 'Maximum Value',
                name: 'max',
                type: 'number',
                default: 100,
                description: 'Maximum value (inclusive)',
                displayOptions: {
                    show: {
                        operation: ['integer', 'decimal'],
                    },
                },
            },
            {
                displayName: 'Number of Values',
                name: 'count',
                type: 'number',
                default: 1,
                description: 'How many random numbers to generate',
                typeOptions: {
                    minValue: 1,
                    maxValue: 10000,
                },
            },
            {
                displayName: 'Decimal Places',
                name: 'decimalPlaces',
                type: 'number',
                default: 2,
                description: 'Number of decimal places',
                typeOptions: {
                    minValue: 1,
                    maxValue: 20,
                },
                displayOptions: {
                    show: {
                        operation: ['decimal'],
                    },
                },
            },
        ],
    };
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            try {
                const operation = this.getNodeParameter('operation', i);
                const min = this.getNodeParameter('min', i);
                const max = this.getNodeParameter('max', i);
                const count = this.getNodeParameter('count', i);
                let apiUrl = 'https://api.random.org/json-rpc/4/invoke';
                let requestBody;
                if (operation === 'integer') {
                    requestBody = {
                        jsonrpc: '2.0',
                        method: 'generateIntegers',
                        params: {
                            apiKey: null, // Using free tier
                            n: count,
                            min: min,
                            max: max,
                            replacement: true,
                        },
                        id: Date.now(),
                    };
                }
                else if (operation === 'decimal') {
                    const decimalPlaces = this.getNodeParameter('decimalPlaces', i);
                    requestBody = {
                        jsonrpc: '2.0',
                        method: 'generateDecimalFractions',
                        params: {
                            apiKey: null, // Using free tier
                            n: count,
                            decimalPlaces: decimalPlaces,
                            replacement: true,
                        },
                        id: Date.now(),
                    };
                }
                const response = await this.helpers.request({
                    method: 'POST',
                    url: apiUrl,
                    body: requestBody,
                    json: true,
                });
                if (response.error) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Random.org API Error: ${response.error.message}`, { itemIndex: i });
                }
                let randomValues = response.result.random.data;
                // For decimal operation, scale the values to the desired range
                if (operation === 'decimal') {
                    randomValues = randomValues.map((value) => {
                        return min + value * (max - min);
                    });
                }
                const json = {
                    operation,
                    count,
                    min,
                    max,
                    values: randomValues,
                    timestamp: new Date().toISOString(),
                };
                if (operation === 'decimal') {
                    json.decimalPlaces = this.getNodeParameter('decimalPlaces', i);
                }
                returnData.push({
                    json,
                });
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error.message,
                        },
                    });
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.Random = Random;
//# sourceMappingURL=Random.node.js.map