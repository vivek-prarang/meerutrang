import { recordVisit, getTodayVisitors, getTotalTodayVisitors } from '@/lib/db';

export async function POST(request) {
  try {
    const { page } = await request.json();

    if (!page) {
      return Response.json(
        { error: 'Page parameter is required' },
        { status: 400 }
      );
    }

    // Get client IP
    const ip = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Get user agent
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Record the visit
    recordVisit(page, ip, userAgent);

    return Response.json({
      success: true,
      message: 'Visit recorded successfully'
    });
  } catch (error) {
    console.error('Error in track visitor route:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');

    let data;
    if (page) {
      data = getTodayVisitors(page);
    } else {
      const visitors = getTodayVisitors();
      const total = getTotalTodayVisitors();
      data = {
        pages: visitors,
        total
      };
    }

    return Response.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in get visitors route:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
