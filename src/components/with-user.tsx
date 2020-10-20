import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Art } from "models/art";
import { Artist } from "models/artist";

import { RootState } from "services/index";

export interface UserProps {
  user: {
    artist: Artist;
    arts: Art[];
  };
}

// ## Usage
// ```
// const SettingPageInner: React.FC<UserProps> = ({user}) => (
//   <h2>{user.artist.name}</h2>
// );
//
// const SettingPage: React.FC = withUser(SettingPageInner);
// ```
export function withUser<P extends UserProps>(
  WrappedComponent: React.FC<P>
): React.FC<Omit<P, keyof UserProps>> {
  const WithUser: React.FC<Omit<P, keyof UserProps>> = (props) => {
    const user = useSelector((state: RootState) => state.login.user);

    if (user === "checking") {
      return (
        <div>
          <h3>Checking...</h3>
        </div>
      );
    } else if (user === null) {
      return (
        <div>
          <h3>
            <Link to="/signin">ログイン</Link>が必要です
          </h3>
        </div>
      );
    } else {
      return <WrappedComponent user={user} {...(props as any)} />;
    }
  };

  return WithUser;
}
