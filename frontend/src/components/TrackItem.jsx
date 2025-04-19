import {Tag} from 'antd'

export default function TrackItem({id, title, artist, album, genres, coverImage}) {
  return (
    <div>
      <div className=' w-3/4 flex items-center gap-5 border-2 p-3 rounded-3xl border-blue-200 bg-blue-50'>
        <img src={coverImage} alt="Track cover image" className='w-20 h-20 object-cover rounded-2xl'></img>
        <div className='flex flex-col items-start'>
          <div className='flex gap-5'>
            <h1>{title}</h1>
            <p>{artist}</p>
            <p>{album}</p>
          </div>
          <p>
            {genres.map((genre) => (
              <Tag key={genre} bordered={false} color="blue">
                {genre}
              </Tag>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}