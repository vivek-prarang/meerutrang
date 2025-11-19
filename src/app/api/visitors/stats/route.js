import { getTodayVisitors, getTotalTodayVisitors, getVisitorStats, getAllVisitorsHistory } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'today'; // today, page, stats, history
    const page = searchParams.get('page');
    const days = searchParams.get('days') ? parseInt(searchParams.get('days')) : 7;

    let data;

    switch (type) {
      case 'today':
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
        break;

      case 'page':
        if (!page) {
          return Response.json(
            { error: 'Page parameter is required for page stats' },
            { status: 400 }
          );
        }
        data = getTodayVisitors(page);
        break;

      case 'stats':
        if (!page) {
          return Response.json(
            { error: 'Page parameter is required for stats' },
            { status: 400 }
          );
        }
        data = getVisitorStats(page, days);
        break;

      case 'history':
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : 30;
        data = getAllVisitorsHistory(limit);
        break;

      default:
        return Response.json(
          { error: 'Invalid type parameter' },
          { status: 400 }
        );
    }

    return Response.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in stats route:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
