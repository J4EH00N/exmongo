import connectMongodb from '@/libs/mongodb'
import Topic from '@/models/topic'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  // 1. { params } 대신 context를 받고 타입을 Promise로 수정합니다.
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 2. context.params를 await 하여 실제 id를 추출합니다.
    const { id } = await context.params
    const { newTitle: title, newDescription: description } =
      await request.json()
    if (!title || !description) {
      return NextResponse.json(
        { message: 'Title and description required!' },
        { status: 400 }
      )
    }
    await connectMongodb()
    const updatedTopic = await Topic.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    )
    if (!updatedTopic) {
      return NextResponse.json({ message: 'Topic not found' }, { status: 400 })
    }
    return NextResponse.json(
      { message: 'Topic updated successfully!', topic: updatedTopic },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in PUT /api/topics', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  // 3. GET 함수도 동일하게 수정합니다.
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 4. GET 함수도 params를 await 합니다.
    const { id } = await context.params
    await connectMongodb()

    // 참고: findById는 객체({ _id: id }) 대신 id 문자열만 전달하는 것이 일반적입니다.
    const topic = await Topic.findById(id)

    if (!topic) {
      return NextResponse.json({ message: 'Topic not found' }, { status: 404 })
    }
    return NextResponse.json({ topic }, { status: 200 })
  } catch (error) {
    console.error('Error in GET /api/topics/[id]:', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
