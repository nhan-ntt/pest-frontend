/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Link } from 'react-router-dom';

export function BreadCrumbs({ items }: any) {
  if (!items || !items.length) {
    return null;
  }
  return (
    <ul className="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 my-2">
      <li className="breadcrumb-item">
        <Link to="/predict-management">
          <i className="flaticon2-shelter text-muted icon-1x" />
        </Link>
      </li>
      {items.map((item: any, index: number) => (
        <li key={`bc${index}`} className="breadcrumb-item">
          <Link className="text-muted" to={{ pathname: item.pathname }}>
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
