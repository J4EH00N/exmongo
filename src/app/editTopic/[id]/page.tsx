// 'fetch' 대신 DB 연결과 모델을 직접 가져옵니다.
import connectMongodb from '@/libs/mongodb'
import Topic from '@/models/topic'
import EditTopicForm from '../../components/EditTopicForm'

// const apiUrl = process.env.API_URL // <-- 이 줄(fetch)이 더 이상 필요 없습니다.

// getTopicById 함수가 DB에 직접 쿼리하도록 수정합니다.
const getTopicById = async (id: string) => {
  try {
    // 1. DB에 연결
    await connectMongodb()

    // 2. fetch 대신 Topic 모델로 직접 id를 검색
    const topic = await Topic.findById(id)

    if (!topic) {
      throw new Error('Failed to find topic.')
    }

    // 3. API 라우트와 동일한 { topic } 형식으로 반환
    return { topic }
  } catch (error) {
    console.log(error)
    // 오류 발생 시 컴포넌트가 깨지지 않도록 null을 반환
    return { topic: null }
  }
}

export default async function EditTopic({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params

  // 4. DB에서 직접 가져온 데이터를 사용
  const { topic } = await getTopicById(id)

  // 5. (중요) topic이 null일 경우를 대비한 방어 코드
  if (!topic) {
    return <div>Error: Topic not found.</div>
  }

  const { title, description } = topic
  return <EditTopicForm id={id} title={title} description={description} />
}
