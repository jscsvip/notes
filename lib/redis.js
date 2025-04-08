// 导入Redis客户端
import Redis from 'ioredis'

// 创建Redis连接实例
const redis = new Redis()

// 初始化数据，用于数据库为空时填充的示例笔记
const initialData = {
  "1702459181837": '{"title":"sunt aut","content":"quia et suscipit suscipit recusandae","updateTime":"2023-12-13T09:19:48.837Z"}',
  "1702459182837": '{"title":"qui est","content":"est rerum tempore vitae sequi sint","updateTime":"2023-12-13T09:19:48.837Z"}',
  "1702459188837": '{"title":"ea molestias","content":"et iusto sed quo iure","updateTime":"2023-12-13T09:19:48.837Z"}'
}

/**
 * 获取所有笔记
 * @description 从Redis中获取所有笔记，如果数据库为空则添加初始示例数据
 * @returns {Promise<Object>} 返回包含所有笔记的对象，key为笔记ID，value为笔记内容
 */
export async function getAllNotes() {
  const data = await redis.hgetall("notes");
  if (Object.keys(data).length == 0) {
    await redis.hmset("notes", initialData);
  }
  return await redis.hgetall("notes")
}

/**
 * 添加新笔记
 * @description 创建新笔记，使用当前时间戳作为唯一标识符
 * @param {string} data 笔记数据的JSON字符串
 * @returns {Promise<string>} 返回新创建笔记的UUID
 */
export async function addNote(data) {
  const uuid = Date.now().toString();
  await redis.hmset("notes", [uuid], data);
  return uuid
}

/**
 * 更新笔记
 * @description 根据UUID更新指定笔记的内容
 * @param {string} uuid 笔记的唯一标识符
 * @param {string} data 更新后的笔记数据JSON字符串
 * @returns {Promise<void>}
 */
export async function updateNote(uuid, data) {
  await redis.hmset("notes", [uuid], data);
}

/**
 * 获取单个笔记
 * @description 根据UUID获取指定笔记，并将JSON字符串解析为对象
 * @param {string} uuid 笔记的唯一标识符
 * @returns {Promise<Object>} 返回解析后的笔记对象
 */
export async function getNote(uuid) {
  return JSON.parse(await redis.hget("notes", uuid));
}

/**
 * 删除笔记
 * @description 根据UUID删除指定的笔记
 * @param {string} uuid 要删除的笔记的唯一标识符
 * @returns {Promise<number>} 返回操作结果，1表示成功删除，0表示笔记不存在
 */
export async function delNote(uuid) {
  return redis.hdel("notes", uuid)
}

export default redis