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
        function parseMatrix(str) {
            return str.split(';').map(row => row.split(',').map(num => Number(num.trim())));
        }

        function matrixAdd(A, B) {
            return A.map((row, i) => row.map((val, j) => val + B[i][j]));
        }

        function matrixSub(A, B) {
            return A.map((row, i) => row.map((val, j) => val - B[i][j]));
        }

        function matrixMultiply(A, B) {
            if (A[0].length !== B.length) {
                throw new Error("Số cột của ma trận A phải bằng số hàng của ma trận B");
            }
            let result = Array.from({ length: A.length }, () => Array(B[0].length).fill(0));
            for (let i = 0; i < A.length; i++) {
                for (let j = 0; j < B[0].length; j++) {
                    for (let k = 0; k < A[0].length; k++) {
                        result[i][j] += A[i][k] * B[k][j];
                    }
                }
            }
            return result;
        }

        function matrixTranspose(A) {
            return A[0].map((_, colIndex) => A.map(row => row[colIndex]));
        }

        function matrixDeterminant(A) {
            if (A.length !== A[0].length) {
                throw new Error("Ma trận phải vuông để tính định thức");
            }
            const n = A.length;
            if (n === 1) return A[0][0];
            if (n === 2) return A[0][0] * A[1][1] - A[0][1] * A[1][0];
            let det = 0;
            for (let col = 0; col < n; col++) {
                let subMatrix = A.slice(1).map(row => row.filter((_, j) => j !== col));
                det += (col % 2 === 0 ? 1 : -1) * A[0][col] * matrixDeterminant(subMatrix);
            }
            return det;
        }

        function matrixToString(matrix) {
            return matrix.map(row => row.join('\t')).join('\n');
        }

        const operation = interaction.options.getString('operation').toLowerCase();
        const matrix1Str = interaction.options.getString('matrix1');
        const matrix2Str = interaction.options.getString('matrix2');

        try {
            const A = parseMatrix(matrix1Str);
            let result;

            if (operation === 'add' || operation === 'subtract' || operation === 'multiply') {
                if (!matrix2Str) {
                    return interaction.reply({ content: "Lệnh này yêu cầu nhập cả hai ma trận.", ephemeral: true });
                }
                const B = parseMatrix(matrix2Str);
                result = operation === 'add' ? matrixAdd(A, B) : operation === 'subtract' ? matrixSub(A, B) : matrixMultiply(A, B);
            } else if (operation === 'transpose') {
                result = matrixTranspose(A);
            } else if (operation === 'determinant') {
                return interaction.reply({ content: `Định thức: ${matrixDeterminant(A)}` });
            } else {
                return interaction.reply({ content: "Phép toán không hợp lệ!", ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle('Kết quả phép toán ma trận')
                .addFields({ name: 'Kết quả', value: `\n\n\`${matrixToString(result)}\`` });
            return interaction.reply({ embeds: [embed] });
        } catch (err) {
            return interaction.reply({ content: `❌ Lỗi: ${err.message}`, ephemeral: true });
        }
    }
};
