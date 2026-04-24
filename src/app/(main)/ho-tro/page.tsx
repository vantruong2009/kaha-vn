import { getPage } from '@/lib/get-page';
import HoTroClient from './HoTroClient';

export default async function HoTroPage() {
  const page = await getPage('ho-tro');
  if (page?.content) {
    return (
      <div style={{ background: '#FAF7F2', minHeight: '100vh' }}>
        <div style={{ background: 'linear-gradient(to bottom, #FFFDF8, #FAF7F2)', borderBottom: '1px solid #EDE5D8' }}>
          <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold" style={{ color: '#1a1a1a' }}>{page.meta_title || page.title || 'Hỗ Trợ Khách Hàng'}</h1>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div
            className="relative overflow-hidden prose max-w-none"
            style={{ background: '#FFFFFF', border: '1px solid #EDE5D8', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '40px' }}
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </div>
    );
  }
  return <HoTroClient />;
}
