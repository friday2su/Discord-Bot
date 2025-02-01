const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('matran')
        .setDescription('Giải các bài toán liên quan đến ma trận')
        .addStringOption(option =>
            option.setName('operation')
                .setDescription('Phép toán: add, subtract, multiply, transpose, determinant')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('matrix1')
                .setDescription('Ma trận thứ nhất (ví dụ: "1,2;3,4")')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('matrix2')
                .setDescription('Ma trận thứ hai (cần cho các phép cộng, trừ, nhân)')
                .setRequired(false)
        ),
    async execute(interaction) {
        // Helper: parse matrix from string format "1,2;3,4"
        function parseMatrix(str) {
            try {
                const rows = str.split(';').map(row => row.trim()).filter(row => row.length);
                const matrix = rows.map(row => row.split(',').map(num => Number(num.trim())));
                // Kiểm tra nếu có số NaN thì báo lỗi
                for (const row of matrix) {
                    if (row.some(num => isNaN(num))) throw new Error("Input không hợp lệ");
                }
                return matrix;
            } catch (err) {
                throw new Error("Không thể parse ma trận. Vui lòng nhập theo định dạng: 1,2;3,4");
            }
        }
        
        // Hàm cộng 2 ma trận
        function matrixAdd(A, B) {
            if (A.length !== B.length || A[0].length !== B[0].length) {
                throw new Error("Hai ma trận không cùng kích thước cho phép tính cộng.");
            }
            return A.map((row, i) => row.map((val, j) => val + B[i][j]));
        }
        
        // Hàm trừ 2 ma trận
        function matrixSub(A, B) {
            if (A.length !== B.length || A[0].length !== B[0].length) {
                throw new Error("Hai ma trận không cùng kích thước cho phép tính trừ.");
            }
            return A.map((row, i) => row.map((val, j) => val - B[i][j]));
        }
        
        // Hàm nhân 2 ma trận
        function matrixMultiply(A, B) {
            if (A[0].length !== B.length) {
                throw new Error("Số cột của ma trận thứ nhất phải bằng số hàng của ma trận thứ hai.");
            }
            let result = [];
            for (let i = 0; i < A.length; i++) {
                result[i] = [];
                for (let j = 0; j < B[0].length; j++) {
                    let sum = 0;
                    for (let k = 0; k < A[0].length; k++) {\n                        sum += A[i][k] * B[k][j];
                    }
                    result[i][j] = sum;
                }
            }
            return result;
        }
        
        // Hàm chuyển vị ma trận
        function matrixTranspose(A) {
            return A[0].map((_, colIndex) => A.map(row => row[colIndex]));
        }
        
        // Hàm tính định thức của ma trận vuông (sử dụng đệ quy)
        function matrixDeterminant(A) {
            if (A.length !== A[0].length) {
                throw new Error("Ma trận phải vuông để tính định thức.");
            }
            const n = A.length;
            if (n === 1) return A[0][0];
            if (n === 2) return A[0][0] * A[1][1] - A[0][1] * A[1][0];
            let det = 0;
            for (let col = 0; col < n; col++) {
                // Tạo ma trận con loại bỏ hàng đầu và cột hiện tại\n                const subMatrix = A.slice(1).map(row => row.filter((_, j) => j !== col));\n                det += ((col % 2 === 0 ? 1 : -1) * A[0][col] * matrixDeterminant(subMatrix));\n            }\n            return det;\n        }
        
        // Hàm chuyển đổi ma trận thành chuỗi hiển thị
        function matrixToString(matrix) {
            return matrix.map(row => row.join('\t')).join('\n');
        }
        
        const operation = interaction.options.getString('operation').toLowerCase();
        const matrix1Str = interaction.options.getString('matrix1');
        const matrix2Str = interaction.options.getString('matrix2');
        
        let resultStr = \"\";
        try {
            const A = parseMatrix(matrix1Str);
            let result;
            
            if (operation === 'add' || operation === 'subtract' || operation === 'multiply') {
                if (!matrix2Str) {
                    return interaction.reply({ content: "Lệnh này yêu cầu nhập cả hai ma trận.", ephemeral: true });
                }
                const B = parseMatrix(matrix2Str);
                if (operation === 'add') result = matrixAdd(A, B);
                if (operation === 'subtract') result = matrixSub(A, B);
                if (operation === 'multiply') result = matrixMultiply(A, B);
                resultStr = matrixToString(result);
            } else if (operation === 'transpose') {\n                result = matrixTranspose(A);\n                resultStr = matrixToString(result);\n            } else if (operation === 'determinant') {\n                const det = matrixDeterminant(A);\n                resultStr = det.toString();\n            } else {\n                return interaction.reply({ content: `Phép toán '${operation}' không hợp lệ. Các phép được hỗ trợ: add, subtract, multiply, transpose, determinant.`, ephemeral: true });\n            }\n        } catch (err) {\n            return interaction.reply({ content: `❌ Lỗi: ${err.message}`, ephemeral: true });\n        }\n        \n        const embed = new EmbedBuilder()\n            .setColor('Green')\n            .setTitle('Kết quả phép toán ma trận')\n            .addFields(\n                { name: 'Phép toán', value: operation, inline: true },\n                { name: 'Kết quả', value: '```\n' + resultStr + '\n```' }\n            );\n        \n        return interaction.reply({ embeds: [embed] });\n    }\n};
