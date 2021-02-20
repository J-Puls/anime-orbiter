import { useContext } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import GlobalAppContext from "../../context/GlobalContext";
import { useUserInfo, useBillboardTitle } from "../../context/hooks";
import removeTitle from "../../utils/content/removeTitle";

export const Billboard = (props) => {
  const GlobalContext = useContext(GlobalAppContext);
  const user = useUserInfo();
  const title = useBillboardTitle();
  const handleCloseModal = () => {
    GlobalContext.resetModalAndClose();
  };

  const handleRemoveTitle = async () => {
    const response = await removeTitle({
      token: user.session_token,
      titleId: title.id,
      uid: user.credentials.uid,
    });

    GlobalContext.setUser({ ...user, list: response.list.reverse() });
    GlobalContext.setBillboardTitle(response.list[0] || null);
    GlobalContext.resetModalAndClose();
  };

  const setModalInfoAbout = () => {
    GlobalContext.setModalInfo({
      title: <p className="text-danger">{title.name}</p>,
      body: title.summary,
      footer: (
        <Button variant="outline-secondary" onClick={handleCloseModal}>
          Close
        </Button>
      ),
    });
    GlobalContext.setModalVisible(true);
  };

  const setModalInfoRemove = () => {
    GlobalContext.setModalInfo({
      title: title.name,
      body: `<p class="text-center">
          Are you sure you want to delete this title?
          <br />
          <strong class="text-danger">This cannot be undone!</strong>
        </p>`,
      footer: (
        <>
          <Button variant="outline-danger" onClick={handleRemoveTitle}>
            Confirm
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
        </>
      ),
    });
    GlobalContext.setModalVisible(true);
  };

  const pickBgImg = () => {
    const images = title.image;
    if (images.background) {
      return { url: images.background.original.url, size: "contain" };
    } else return { url: images.poster.original.url, size: "contain" };
  };

  const bg = pickBgImg();

  return (
    <Container>
      <Row
        className="billboard"
        style={{
          backgroundImage: `url("${bg.url.replace("http://", "https://")}")`,
          backgroundSize: bg.size,
        }}
      >
        <Col className="info" xs={12} sm={6} md={4} lg={4}>
          <p className={`h3 name text-danger ${title.favorite && "favorite"}`}>
            {title.name}
          </p>

          <div
            className="summary"
            dangerouslySetInnerHTML={{ __html: title.summary }}
          ></div>

          <div className="card-buttons d-flex justify-content-around">
            <Button variant="primary" onClick={setModalInfoAbout}>
              More Info
            </Button>
            <Button variant="outline-danger" onClick={setModalInfoRemove}>
              Remove
            </Button>
          </div>
        </Col>
        <Col className="image-fader"></Col>
      </Row>
    </Container>
  );
};

export default Billboard;
