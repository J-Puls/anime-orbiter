export const navTo = (history, context, url, view) => {

    if (context.current_view !== view) context.setCurrentView(view);
    if (history.location.pathname !== url) history.push(`/${url}`);

};

export default navTo;
