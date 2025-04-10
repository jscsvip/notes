/**
 * 延迟指定的毫秒数
 * @param {number} ms 延迟的毫秒数
 * @returns {Promise<void>}
 */
export const sleep = ms => new Promise(r => setTimeout(r, ms));