"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Random = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class Random {
    constructor() {
        this.description = {
            displayName: 'Random',
            name: 'random',
            icon: 'fa:random',
            group: ['transform'],
            version: 1,
            description: 'True Random Number Generator via Random.org',
            defaults: { name: 'Random' },
            inputs: ["main" /* NodeConnectionType.Main */],
            outputs: ["main" /* NodeConnectionType.Main */],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    options: [
                        {
                            name: 'True Random Number Generator',
                            value: 'trng',
                            description: 'Generate a true random integer using Random.org',
                        },
                    ],
                    default: 'trng',
                },
                {
                    displayName: 'Min',
                    name: 'min',
                    type: 'number',
                    typeOptions: { minValue: -2147483648, maxValue: 2147483647 },
                    default: 1,
                    required: true,
                    description: 'Minimum integer (inclusive)'
                },
                {
                    displayName: 'Max',
                    name: 'max',
                    type: 'number',
                    typeOptions: { minValue: -2147483648, maxValue: 2147483647 },
                    default: 60,
                    required: true,
                    description: 'Maximum integer (inclusive)'
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            const operation = this.getNodeParameter('operation', i);
            if (operation !== 'trng') {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Unsupported operation', { itemIndex: i });
            }
            const min = this.getNodeParameter('min', i);
            const max = this.getNodeParameter('max', i);
            // validações
            if (!Number.isInteger(min) || !Number.isInteger(max)) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Min e Max devem ser inteiros', { itemIndex: i });
            }
            if (min > max) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Min não pode ser maior que Max', { itemIndex: i });
            }
            const url = `https://www.random.org/integers/?num=1&min=${encodeURIComponent(min)}&max=${encodeURIComponent(max)}&col=1&base=10&format=plain&rnd=new`;
            const response = await this.helpers.httpRequest({
                method: 'GET',
                url,
                headers: { 'Accept': 'text/plain' },
                returnFullResponse: false,
            });
            // Random.org retorna texto simples com um número e \n
            const bodyText = (typeof response === 'string') ? response : String(response);
            const value = parseInt(bodyText.trim(), 10);
            if (!Number.isFinite(value)) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Resposta inválida da Random.org', { itemIndex: i });
            }
            returnData.push({
                json: {
                    value,
                    min,
                    max,
                    source: 'random.org',
                    url,
                    timestamp: new Date().toISOString(),
                },
            });
        }
        return [returnData];
    }
}
exports.Random = Random;
