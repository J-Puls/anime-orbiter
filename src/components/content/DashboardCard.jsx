import favorite from '../../assets/svg/favorite.svg';

export const DashboardCard = props => {

    const title = props.title;

    return (
    <div
      style={{ backgroundImage: `url("${title.image.poster.original.url.replace('http://', 'https://')}")` }}
      className={`title-card position-relative mx-1 rounded ${
        title.favorite ? 'favorite' : ''
      }`}
      onClick={() => props.onClick(title)}
    >
      <div className="title-card-overlay position-absolute top-0 left-0 d-flex flex-column justify-content-around text-center">
        <button
          className="favorite-button"
          aria-label={title.favorite ? 'remove favorite' : 'add favorite'}
          title={title.favorite ? 'remove favorite' : 'add favorite'}
          onClick={() => props.onFavoriteToggle(title.id)}
        >
          <svg width="24" height="24">
            <use
              xlinkHref={`${favorite}#${
                title.favorite ? 'favorite' : 'add-to-favorites'
              }`}
            />
          </svg>
        </button>
      </div>
    </div>
    );

};

export default DashboardCard;
